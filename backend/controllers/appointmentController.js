const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { clientId, employeeId, serviceId, dateTime } = req.body;

    // Determinar quién es el cliente de la cita
    let finalClientId = clientId;

    // Si el usuario autenticado es cliente → siempre usa su propio ID
    if (req.user.role === "client") {
      finalClientId = req.user.id;
    }

    // Validar fecha en el futuro
    if (new Date(dateTime) < new Date()) {
      return res
        .status(400)
        .json({ message: "No se puede agendar una cita en el pasado." });
    }

    // Validar si ya existe una cita con ese empleado en la misma fecha y hora
    const existingAppointment = await Appointment.findOne({
      employeeId,
      dateTime,
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "El empleado ya tiene una cita en ese horario." });
    }

    // Crear la cita
    const newAppointment = new Appointment({
      clientId: finalClientId,
      employeeId,
      serviceId,
      dateTime,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Cita creada correctamente",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la cita", error });
  }
};

const getAppointments = async (req, res) => {
  try {
    let filter = {};

    // Si es cliente → solo sus citas
    if (req.user.role === "client") {
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
    res.status(500).json({ message: "Error al obtener citas", error });
  }
};


const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar estado permitido
    const allowedStatuses = ["pending", "completed", "canceled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    // Buscar cita
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // Validar reglas de negocio: solo cambiar desde pending
    if (appointment.status !== "pending") {
      return res.status(409).json({ message: "Solo se pueden actualizar citas pendientes" });
    }

    appointment.status = status;
    appointment.updatedBy = req.user.id; // opcional: auditar quién lo cambió
    await appointment.save();

    res.status(200).json({
      message: "Estado actualizado correctamente",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cita", error });
  }
};


module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};

