/**
 * backend/controllers/paymentController.js
 *
 * Controlador de pagos: crea PaymentIntent (checkout), simula pago (mockPay)
 * y consulta intent (getIntent). También finaliza la intent creando la cita
 * y la factura (finalizeIntent).
 *
 * REQUISITOS/ASUNCIONES:
 * - Las rutas sensibles deben estar protegidas con un middleware de auth
 *   para asegurar que req.user esté presente cuando la app exige login.
 * - El esquema Appointment exige clientId; por tanto finalizeIntent exige
 *   intent.userId (usuario autenticado). Si quieres admitir invitados,
 *   adapta finalizeIntent y el esquema Appointment.
 */

const PaymentIntent = require("../models/PaymentIntent");
const Appointment = require("../models/Appointment");
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const Service = require("../models/Service");
const { sendBookingConfirmationEmail } = require("../config/emailService");

/**
 * Calcula el total seguro en backend a partir del snapshot del carrito.
 * Lanza errores si algún producto/servicio no existe o si falta stock.
 */
async function calcTotal(cart = []) {
  let total = 0;
  for (const item of cart) {
    const qty = item.cantidad || 1;
    if (item.type === "producto") {
      const p = await Product.findById(item.id).select("price manageStock stock name");
      if (!p) throw new Error(`Producto no encontrado: ${item.id}`);
      if (p.manageStock !== false && p.stock < qty) {
        throw new Error(`Stock insuficiente para ${p.name}`);
      }
      total += qty * (p.price || 0);
    } else if (item.type === "servicio") {
      const s = await Service.findById(item.id).select("price name");
      if (!s) throw new Error(`Servicio no encontrado: ${item.id}`);
      total += qty * (s.price || 0);
    } else {
      // fallback: si el item trae price en el snapshot (no recomendado)
      total += qty * (item.price || 0);
    }
  }
  return total;
}

/**
 * Finaliza una PaymentIntent (idempotente).
 * - Verifica intent.status === 'succeeded'
 * - Si ya tiene appointmentId && invoiceId, devuelve los ids (idempotencia).
 * - Requiere intent.userId (si tu negocio exige login para crear citas).
 * - Revalida solapamientos antes de crear la cita.
 * - Crea Appointment y Invoice, descuenta stock y envía email de confirmación.
 */
async function finalizeIntent(intent) {
  if (!intent) throw new Error("Intent inválido");
  if (intent.status !== "succeeded") throw new Error("Intent no está pagado");

  // Idempotencia: si ya fue finalizado devuelve lo existente
  if (intent.appointmentId && intent.invoiceId) {
    return {
      appointmentId: intent.appointmentId,
      invoiceId: intent.invoiceId,
      total: intent.amount,
    };
  }

  // Si tu flujo exige que el usuario esté autenticado para crear la cita
  if (!intent.userId) {
    throw new Error("No se puede crear la cita: usuario no autenticado (clientId ausente).");
  }

  // Revalidar solapamiento extremo (por si cambió entre creación de intent y confirmación)
  const { employeeId, dateTime, durationMinutes } = intent.appointment || {};
  if (!employeeId || !dateTime) {
    throw new Error("Appointment data incompleta en intent");
  }

  // Check conflicts: citas confirmadas en la DB (status != cancelada)
  const conflict = await Appointment.findOne({
    employeeId,
    dateTime,
    status: { $ne: "cancelada" },
  });
  if (conflict) throw new Error("Horario no disponible al confirmar");

  // Crear cita (clientId = intent.userId)
  const newAppointment = await Appointment.create({
    clientId: intent.userId,
    employeeId,
    serviceId: intent.appointment.serviceId,
    dateTime: intent.appointment.dateTime,
    status: "confirmada",
    notes: intent.customer?.notes || null,
  });

  // Crear factura: construimos líneas con price, name y quantity y calculamos total
  const cartProducts = (intent.cart || []).filter(i => i.type === "producto");
  const invoiceProducts = [];
  let invoiceTotal = 0;

  for (const item of cartProducts) {
    const p = await Product.findById(item.id).select("price name manageStock stock");
    if (!p) {
      // En teoría no debe suceder porque calcTotal validó, pero lo revisamos de nuevo
      throw new Error(`Producto no encontrado al crear factura: ${item.id}`);
    }

    const qty = item.cantidad || 1;
    const linePrice = p.price || 0;

    // Validar stock de nuevo antes de descontar
    const manageStock = p.manageStock !== false;
    if (manageStock) {
      if (p.stock < qty) {
        throw new Error(`Stock insuficiente para ${p.name}`);
      }
      // Descontamos aquí para evitar inconsistencias si la factura se crea
      await Product.findByIdAndUpdate(p._id, { $inc: { stock: -qty } });
    }

    invoiceProducts.push({
      productId: p._id,
      name: p.name,
      price: linePrice,
      quantity: qty,
    });

    invoiceTotal += linePrice * qty;
  }

  const newInvoice = await Invoice.create({
    clientId: intent.userId || null,
    appointmentId: newAppointment._id,
    products: invoiceProducts,
    total: invoiceTotal,
    status: "pagada",
    issuedAt: new Date(),
  });

  // Persistir ids para idempotencia
  intent.appointmentId = newAppointment._id;
  intent.invoiceId = newInvoice._id;
  await intent.save();

  // Enviar email de confirmación (no bloqueante para la respuesta)
  try {
    await sendBookingConfirmationEmail({
      to: intent.customer?.email,
      name: intent.customer?.name,
      appointment: newAppointment,
      total: intent.amount || invoiceTotal,
    });
  } catch (e) {
    console.warn("Email confirmación falló:", e?.message || e);
  }

  return {
    appointmentId: newAppointment._id,
    invoiceId: newInvoice._id,
    total: intent.amount || invoiceTotal,
  };
}

/**
 * POST /api/payments/checkout
 * Crea un PaymentIntent y bloquea el slot temporalmente.
 * - Requiere cart, appointment (employeeId, serviceId, dateTime) en body.
 * - Prioriza req.user (auth middleware) como userId; si no existe intenta userId en body.
 * - Valida solapamientos con citas e intents activos.
 */
exports.createCheckout = async (req, res) => {
  try {
    const { cart, appointment, customer } = req.body || {};
    const userIdFromBody = req.body?.userId || null;
    // Prioriza req.user (autenticación por middleware). Si no existe, tomamos userIdFromBody (menos seguro).
    const effectiveUserId = (req.user && (req.user.id || req.user._id)) ? (req.user.id || req.user._id) : (userIdFromBody || null);

    const { employeeId, serviceId, dateTime } = appointment || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Carrito vacío" });
    }
    if (!employeeId || !serviceId || !dateTime) {
      return res.status(400).json({ message: "Datos de cita incompletos" });
    }

    // Obtiene duración desde el servicio
    const service = await Service.findById(serviceId).select("durationMinutes duration").lean();
    const duration = (service?.durationMinutes || service?.duration || 30) | 0;

    const newStart = new Date(dateTime);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    // Validar solapamiento en el mismo día (citas confirmadas + intents activos)
    const dayStr = newStart.toISOString().slice(0, 10);
    const start = new Date(`${dayStr}T00:00:00`);
    const end = new Date(`${dayStr}T23:59:59.999`);

    // Carga citas confirmadas e intents activos
    const appts = await Appointment.find({
      employeeId,
      dateTime: { $gte: start, $lte: end },
      status: { $ne: "cancelada" },
    })
      .select("dateTime serviceId")
      .populate({ path: "serviceId", select: "durationMinutes duration" })
      .lean();

    const intents = await PaymentIntent.find({
      "appointment.employeeId": employeeId,
      "appointment.dateTime": { $gte: start, $lte: end },
      status: { $in: ["created", "pending"] },
      expiresAt: { $gt: new Date() },
    }).select("appointment.dateTime appointment.durationMinutes").lean();

    const intervals = [];

    for (const a of appts) {
      const dur = (a.serviceId?.durationMinutes || a.serviceId?.duration || 30) | 0;
      const s = new Date(a.dateTime);
      const e = new Date(s.getTime() + dur * 60000);
      intervals.push({ start: s, end: e });
    }
    for (const i of intents) {
      const s = new Date(i.appointment.dateTime);
      const e = new Date(s.getTime() + (i.appointment.durationMinutes || 30) * 60000);
      intervals.push({ start: s, end: e });
    }

    const overlaps = intervals.some(iv => newStart < iv.end && iv.start < newEnd);
    if (overlaps) {
      return res.status(409).json({ message: "Horario no disponible para la duración seleccionada" });
    }

    // Calcula total seguro con precios en BD
    const amount = await calcTotal(cart);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos TTL

    const intent = await PaymentIntent.create({
      amount,
      currency: "COP",
      status: "created",
      expiresAt,
      userId: effectiveUserId,
      customer,
      cart,
      appointment: {
        employeeId,
        serviceId,
        dateTime: newStart,
        durationMinutes: duration,
      },
    });

    return res.json({ ok: true, intentId: intent._id, amount, expiresAt, paymentUrl: `/pay/${intent._id}` });
  } catch (error) {
    console.error("createCheckout error:", error);
    return res.status(500).json({ message: error.message || "Error al iniciar checkout" });
  }
};

/**
 * POST /api/payments/mock/pay
 * Endpoint de testing que simula resultado de la pasarela.
 * - body: { intentId, outcome: "succeeded" | "failed" }
 * - Si outcome === "succeeded" se intenta finalizeIntent(intent).
 */
exports.mockPay = async (req, res) => {
  try {
    const { intentId, outcome } = req.body || {};
    if (!intentId || !["succeeded", "failed"].includes(outcome)) {
      return res.status(400).json({ message: "Parámetros inválidos" });
    }

    const intent = await PaymentIntent.findById(intentId);
    if (!intent) return res.status(404).json({ message: "Intent no encontrado" });

    // Si expiró, marcar y devolver 410
    if (intent.expiresAt <= new Date()) {
      intent.status = "expired";
      await intent.save();
      return res.status(410).json({ message: "Intent expirado" });
    }

    // Si ya fue confirmado, intentar finalizeIntent por si quedó incompleto (idempotencia)
    if (intent.status === "succeeded") {
      try {
        const result = await finalizeIntent(intent);
        return res.json({ ok: true, ...result, message: "Pago ya confirmado" });
      } catch (err) {
        console.error("finalizeIntent error on already succeeded:", err);
        return res.status(500).json({ message: err.message || "Error al finalizar intent" });
      }
    }

    if (!["created", "pending"].includes(intent.status)) {
      return res.status(400).json({ message: `No se puede actualizar desde ${intent.status}` });
    }

    // Actualiza estado
    intent.status = outcome;
    await intent.save();

    if (outcome === "succeeded") {
      try {
        const result = await finalizeIntent(intent);
        return res.json({ ok: true, ...result, message: "Pago simulado exitoso y reserva confirmada" });
      } catch (err) {
        console.error("finalizeIntent error:", err);
        return res.status(500).json({ message: err.message || "Error al confirmar pago" });
      }
    } else {
      return res.json({ ok: true, message: "Pago simulado fallido" });
    }
  } catch (error) {
    console.error("mockPay unexpected error:", error);
    return res.status(500).json({ message: error.message || "Error en pago simulado" });
  }
};

/**
 * GET /api/payments/intent/:id
 * Devuelve información básica del intent (estado, amount, expiresAt, ids).
 */
exports.getIntent = async (req, res) => {
  try {
    const intent = await PaymentIntent.findById(req.params.id);
    if (!intent) return res.status(404).json({ message: "Intent no encontrado" });

    // Marcar expirado si corresponde
    if (intent.status !== "succeeded" && intent.expiresAt <= new Date()) {
      intent.status = "expired";
      await intent.save();
    }

    res.json({
      ok: true,
      intent: {
        id: intent._id,
        status: intent.status,
        amount: intent.amount,
        expiresAt: intent.expiresAt,
        appointmentId: intent.appointmentId,
        invoiceId: intent.invoiceId,
      },
    });
  } catch (error) {
    console.error("getIntent error:", error);
    res.status(500).json({ message: "Error obteniendo intent" });
  }
};