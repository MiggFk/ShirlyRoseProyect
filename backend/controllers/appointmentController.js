  const Appointment = require("../models/Appointment");
  const User = require("../models/User"); // 🔹 NUEVO
  const PaymentIntent = require("../models/PaymentIntent");
  const Service = require("../models/Service");

  function localDayBounds(dateStr) {
    // dateStr: YYYY-MM-DD en zona local del servidor
    const start = new Date(`${dateStr}T00:00:00`);
    const end = new Date(`${dateStr}T23:59:59.999`);
    return { start, end };
  }
  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
  }
  async function buildBusyIntervals({ employeeId, start, end }) {
    const appts = await Appointment.find({
      employeeId,
      dateTime: { $gte: start, $lte: end },
      status: { $ne: "cancelada" },
    }).select("dateTime serviceId")
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
      intervals.push({ start: s, end: e, source: "appointment" });
    }
    for (const i of intents) {
      const s = new Date(i.appointment.dateTime);
      const e = new Date(s.getTime() + (i.appointment.durationMinutes || 30) * 60000);
      intervals.push({ start: s, end: e, source: "intent" });
    }

    intervals.sort((x, y) => x.start - y.start);
    const merged = [];
    for (const it of intervals) {
      if (!merged.length) { merged.push({ ...it }); continue; }
      const last = merged[merged.length - 1];
      if (it.start <= last.end) {
        if (it.end > last.end) last.end = it.end;
      } else {
        merged.push({ ...it });
      }
    }
    return merged;
  }

  // Crear una nueva cita
  const createAppointment = async (req, res) => {
    try {
      const { clientId, employeeId, serviceId, dateTime, status } = req.body;

      let finalClientId = clientId;

      // Si el usuario autenticado es cliente → siempre usa su propio ID
      if (req.user.role === "cliente") {
        finalClientId = req.user.id;
      }

      // 🔹 VALIDACIÓN 1: Fecha en el futuro (PRIMERO)
      if (new Date(dateTime) < new Date()) {
        return res.status(400).json({ message: "No se puede agendar una cita en el pasado." });
      }

      // 🔹 VALIDACIÓN 2: Disponibilidad del empleado
      const existingAppointment = await Appointment.findOne({
        employeeId,
        dateTime,
        status: { $ne: "cancelada" } // Ignorar citas canceladas
      });

      if (existingAppointment) {
        return res.status(400).json({ message: "El empleado ya tiene una cita en ese horario." });
      }

      // Estado inicial
      let appointmentStatus = "pendiente";
      if (req.user.role === "admin" && status) {
        appointmentStatus = status;
      }

      // Crear cita
      const newAppointment = new Appointment({
        clientId: finalClientId,
        employeeId,
        serviceId,
        dateTime,
        status: appointmentStatus,
      });

      await newAppointment.save();

      // 🔹 POPULATE - clientId ahora usa User
      const populatedAppointment = await Appointment.findById(newAppointment._id)
        .populate("clientId", "name email")
        .populate("employeeId", "name email role")
        .populate("serviceId", "name price");

      // 🔹 RESPUESTA ESTANDARIZADA con "data"
      res.status(201).json({
        message: "Cita creada correctamente",
        data: populatedAppointment,
      });
    } catch (error) {
      console.error("Error al crear cita:", error);
      res.status(500).json({ message: "Error al crear la cita", error: error.message });
    }
  };

  // Obtener citas
  const getAppointments = async (req, res) => {
    try {
      let filter = {};

      // Si es cliente → solo sus citas
      if (req.user.role === "cliente") {
        filter.clientId = req.user.id;
      }

      // Filtros opcionales
      if (req.query.status) filter.status = req.query.status;
      if (req.query.from || req.query.to) {
        filter.dateTime = {};
        if (req.query.from) filter.dateTime.$gte = new Date(req.query.from);
        if (req.query.to) filter.dateTime.$lte = new Date(req.query.to);
      }

      // Paginación
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await Appointment.countDocuments(filter);

      // 🔹 POPULATE - clientId ahora usa User directamente
      const appointments = await Appointment.find(filter)
        .populate("clientId", "name email")
        .populate("employeeId", "name email role")
        .populate("serviceId", "name price")
        .sort({ dateTime: 1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        data: appointments,
        total,
        page,
        limit,
      });
    } catch (error) {
      console.error("Error al obtener citas:", error);
      res.status(500).json({ message: "Error al obtener citas", error: error.message });
    }
  };

  // Actualizar estado de cita
  const updateAppointmentStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = ["pendiente", "completada", "cancelada"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Estado inválido" });
      }

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: "Cita no encontrada" });
      }

      const allowedTransitions = {
        pendiente: ["completada", "cancelada"],
        completada: [],
        cancelada: ["pendiente"],
      };

      if (!allowedTransitions[appointment.status].includes(status)) {
        return res.status(409).json({
          message: "No se pudo actualizar, la cita ya fue actualizada.",
        });
      }

      appointment.status = status;
      appointment.updatedBy = req.user.id;
      await appointment.save();

      res.status(200).json({
        message: "Estado actualizado correctamente",
        data: appointment,
      });
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      res.status(500).json({ message: "Error al actualizar cita", error: error.message });
    }
  };

  // Eliminar cita
  const deleteAppointment = async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({ message: "Cita no encontrada" });
      }

      await appointment.deleteOne();
      res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      res.status(500).json({ message: "Error al eliminar cita", error: error.message });
    }
  };

  // Estadísticas
  const getAppointmentStats = async (req, res) => {
    try {
      const totalAppointments = await Appointment.countDocuments();

      const statusStats = await Appointment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const formattedStatus = { pending: 0, completed: 0, cancelled: 0 };
      statusStats.forEach((stat) => {
        if (stat._id === "pendiente") formattedStatus.pending = stat.count;
        if (stat._id === "completada") formattedStatus.completed = stat.count;
        if (stat._id === "cancelada") formattedStatus.cancelled = stat.count;
      });

      const serviceStats = await Appointment.aggregate([
        { $group: { _id: "$serviceId", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "services",
            localField: "_id",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: "$service" },
        {
          $project: {
            _id: 0,
            service: "$service.name",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]);

      const monthlyStats = await Appointment.aggregate([
        { $group: { _id: { $month: "$dateTime" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
      ]);

      const monthNames = [
        "",
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      const formattedMonthly = monthlyStats.map((m) => ({
        month: monthNames[m._id],
        count: m.count,
      }));

      res.json({
        data: {
          totalAppointments,
          status: formattedStatus,
          services: serviceStats,
          monthly: formattedMonthly,
        }
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({ message: "Error al obtener estadísticas", error: error.message });
    }
  };

  // 🆕 Estadísticas avanzadas
  const getAdvancedStats = async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      // 1️⃣ Total de clientes registrados
      const totalClients = await User.countDocuments({ role: "cliente" });
      
      // Clientes nuevos este mes
      const newClientsThisMonth = await User.countDocuments({
        role: "cliente",
        createdAt: { $gte: startOfMonth }
      });

      // 2️⃣ Ingresos (basado en citas completadas)
      const revenueStats = await Appointment.aggregate([
        { 
          $match: { 
            status: "completada",
            dateTime: { $gte: startOfMonth }
          } 
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service"
          }
        },
        { $unwind: "$service" },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$service.price" },
            totalAppointments: { $sum: 1 }
          }
        }
      ]);

      const monthlyRevenue = revenueStats[0]?.totalRevenue || 0;
      const monthlyCompletedAppointments = revenueStats[0]?.totalAppointments || 0;

      // Ingresos del año
      const yearlyRevenueStats = await Appointment.aggregate([
        { 
          $match: { 
            status: "completada",
            dateTime: { $gte: startOfYear }
          } 
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service"
          }
        },
        { $unwind: "$service" },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$service.price" }
          }
        }
      ]);

      const yearlyRevenue = yearlyRevenueStats[0]?.totalRevenue || 0;

      // 3️⃣ Ticket promedio
      const averageTicket = monthlyCompletedAppointments > 0 
        ? monthlyRevenue / monthlyCompletedAppointments 
        : 0;

      // 4️⃣ Servicios más solicitados del mes (top 5)
      const topServices = await Appointment.aggregate([
        { 
          $match: { 
            dateTime: { $gte: startOfMonth }
          } 
        },
        {
          $group: {
            _id: "$serviceId",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "services",
            localField: "_id",
            foreignField: "_id",
            as: "service"
          }
        },
        { $unwind: "$service" },
        {
          $project: {
            _id: 0,
            name: "$service.name",
            category: "$service.category",
            count: 1,
            revenue: { $multiply: ["$count", "$service.price"] }
          }
        }
      ]);

      // 5️⃣ Horarios pico (horas con más citas)
      const peakHours = await Appointment.aggregate([
        { 
          $match: { 
            dateTime: { $gte: startOfMonth }
          } 
        },
        {
          $group: {
            _id: { $hour: "$dateTime" },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            hour: {
              $concat: [
                { $toString: "$_id" },
                ":00"
              ]
            },
            appointments: "$count"
          }
        }
      ]);

      // 6️⃣ Tasa de cancelación
      const totalAppointmentsMonth = await Appointment.countDocuments({
        dateTime: { $gte: startOfMonth }
      });
      
      const cancelledAppointments = await Appointment.countDocuments({
        status: "cancelada",
        dateTime: { $gte: startOfMonth }
      });

      const cancellationRate = totalAppointmentsMonth > 0 
        ? ((cancelledAppointments / totalAppointmentsMonth) * 100).toFixed(1)
        : 0;

      // 7️⃣ Días con más actividad
      const busiestDays = await Appointment.aggregate([
        { 
          $match: { 
            dateTime: { $gte: startOfMonth }
          } 
        },
        {
          $group: {
            _id: { $dayOfWeek: "$dateTime" },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const formattedDays = busiestDays.map(day => ({
        day: dayNames[day._id - 1],
        appointments: day.count
      }));

      // 8️⃣ Clientes recurrentes (con más de 1 cita)
      const recurringClients = await Appointment.aggregate([
        { 
          $match: { 
            status: { $ne: "cancelada" }
          } 
        },
        {
          $group: {
            _id: "$clientId",
            appointmentCount: { $sum: 1 }
          }
        },
        {
          $match: {
            appointmentCount: { $gt: 1 }
          }
        },
        {
          $count: "total"
        }
      ]);

      const recurringClientsCount = recurringClients[0]?.total || 0;
      const recurringRate = totalClients > 0 
        ? ((recurringClientsCount / totalClients) * 100).toFixed(1)
        : 0;

      // 9️⃣ Comparativa mes anterior
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const lastMonthRevenue = await Appointment.aggregate([
        { 
          $match: { 
            status: "completada",
            dateTime: { $gte: lastMonth, $lte: endOfLastMonth }
          } 
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service"
          }
        },
        { $unwind: "$service" },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$service.price" }
          }
        }
      ]);

      const previousMonthRevenue = lastMonthRevenue[0]?.totalRevenue || 0;
      const revenueGrowth = previousMonthRevenue > 0
        ? (((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1)
        : 0;

      res.json({
        data: {
          revenue: {
            monthly: monthlyRevenue,
            yearly: yearlyRevenue,
            previous: previousMonthRevenue,
            growth: parseFloat(revenueGrowth),
            averageTicket: Math.round(averageTicket)
          },
          clients: {
            total: totalClients,
            newThisMonth: newClientsThisMonth,
            recurring: recurringClientsCount,
            recurringRate: parseFloat(recurringRate)
          },
          performance: {
            topServices: topServices,
            peakHours: peakHours,
            busiestDays: formattedDays,
            cancellationRate: parseFloat(cancellationRate)
          }
        }
      });

    } catch (error) {
      console.error("❌ Error al obtener estadísticas avanzadas:", error);
      res.status(500).json({ 
        message: "Error al obtener estadísticas avanzadas", 
        error: error.message 
      });
    }
  };

  // Calcula intervalos ocupados (citas + intents activos) para un día/empleado
  async function buildBusyIntervals({ employeeId, start, end }) {
    const [appts, now, intents] = await Promise.all([
      Appointment.find({
        employeeId,
        dateTime: { $gte: start, $lte: end },
        status: { $ne: "cancelada" },
      })
        .select("dateTime serviceId")
        .populate({ path: "serviceId", select: "durationMinutes duration" })
        .lean(),
      new Date(),
      PaymentIntent.find({
        "appointment.employeeId": employeeId,
        "appointment.dateTime": { $gte: start, $lte: end },
        status: { $in: ["created", "pending"] },
        expiresAt: { $gt: new Date() },
      }).select("appointment.dateTime appointment.durationMinutes").lean(),
    ]);

    const intervals = [];

    // Citas confirmadas
    for (const a of appts) {
      const sDur = (a.serviceId?.durationMinutes || a.serviceId?.duration || 30) | 0;
      const s = new Date(a.dateTime);
      const e = new Date(s.getTime() + (sDur || 30) * 60000);
      intervals.push({ start: s, end: e, source: "appointment" });
    }

    // Intents activos (bloqueo temporal)
    for (const i of intents) {
      const s = new Date(i.appointment.dateTime);
      const e = new Date(s.getTime() + (i.appointment.durationMinutes || 30) * 60000);
      intervals.push({ start: s, end: e, source: "intent" });
    }

    // Opcional: fusionar intervalos superpuestos para simplificar
    intervals.sort((x, y) => x.start - y.start);
    const merged = [];
    for (const it of intervals) {
      if (!merged.length) { merged.push({ ...it }); continue; }
      const last = merged[merged.length - 1];
      if (it.start <= last.end) {
        if (it.end > last.end) last.end = it.end;
      } else {
        merged.push({ ...it });
      }
    }
    return merged;
  }

  // 👇 MEJORADO: disponibilidad por empleado/fecha con intervalos
  async function getAvailability(req, res) {
    try {
      const { employeeId, date } = req.query;
      if (!employeeId || !date) return res.status(400).json({ message: "employeeId y date son requeridos" });

      const { start, end } = localDayBounds(date);
      const intervals = await buildBusyIntervals({ employeeId, start, end });

      return res.json({
        busy: intervals.map(i => i.start),
        busyIntervals: intervals.map(i => ({ start: i.start, end: i.end })),
      });
    } catch (error) {
      console.error("getAvailability error:", error);
      return res.status(500).json({ message: "Error al obtener disponibilidad" });
    }
  }

  // POST /api/appointments/validate
  async function validateSlot(req, res) {
    try {
      const { employeeId, serviceId, dateTime } = req.body || {};
      if (!employeeId || !serviceId || !dateTime) {
        return res.status(400).json({ message: "employeeId, serviceId y dateTime son requeridos" });
      }
      const service = await Service.findById(serviceId).select("durationMinutes duration").lean();
      const duration = (service?.durationMinutes || service?.duration || 30) | 0;

      const startSel = new Date(dateTime);
      const endSel = new Date(startSel.getTime() + duration * 60000);

      const dayStr = startSel.toISOString().slice(0, 10);
      const { start, end } = localDayBounds(dayStr);
      const intervals = await buildBusyIntervals({ employeeId, start, end });

      const hasOverlap = intervals.some(iv => overlaps(startSel, endSel, iv.start, iv.end));
      return res.json({ available: !hasOverlap, durationMinutes: duration });
    } catch (error) {
      console.error("validateSlot error:", error);
      return res.status(500).json({ message: "Error al validar slot" });
    }
  }

  // GET /api/appointments/month-availability?employeeId=&year=2025&month=10&durationMinutes=60&slotMinutes=30&openHour=9&closeHour=18
  async function getMonthAvailability(req, res) {
    try {
      const { employeeId, year, month } = req.query;
      if (!employeeId || !year || !month) {
        return res.status(400).json({ message: "employeeId, year y month son requeridos" });
      }
      const y = parseInt(year, 10);
      const m = parseInt(month, 10); // 1-12
      const slotMinutes = parseInt(req.query.slotMinutes || "30", 10);
      const openHour = parseInt(req.query.openHour || "9", 10);
      const closeHour = parseInt(req.query.closeHour || "18", 10);
      const serviceDuration = parseInt(req.query.durationMinutes || "30", 10);

      const daysInMonth = new Date(y, m, 0).getDate();
      const todayStr = new Date().toISOString().slice(0, 10);

      const days = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const { start, end } = localDayBounds(dateStr);
        const intervals = await buildBusyIntervals({ employeeId, start, end });

        // genera slots del día y cuenta libres considerando duración del servicio
        const startDay = new Date(`${dateStr}T${String(openHour).padStart(2,"0")}:00:00`);
        const endDay = new Date(`${dateStr}T${String(closeHour).padStart(2,"0")}:00:00`);
        let free = 0;
        for (let t = new Date(startDay); t < endDay; t = new Date(t.getTime() + slotMinutes * 60000)) {
          const s = t;
          const e = new Date(s.getTime() + serviceDuration * 60000);
          if (e > endDay) break;
          // bloquea pasado si es hoy
          if (dateStr === todayStr && s <= new Date()) continue;
          const blocked = intervals.some(iv => overlaps(s, e, iv.start, iv.end));
          if (!blocked) free++;
        }
        days[dateStr] = free;
      }
      return res.json({ ok: true, days });
    } catch (error) {
      console.error("getMonthAvailability error:", error);
      return res.status(500).json({ message: "Error al obtener disponibilidad mensual" });
    }
  }

  module.exports = {
    createAppointment,
    getAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    getAppointmentStats,
    getAdvancedStats,
    getAvailability,
    validateSlot,
    getMonthAvailability,
  };