const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { clientId, employeeId, serviceId, dateTime, status } = req.body;

    // Determinar quién es el cliente de la cita
    let finalClientId = clientId;

    // Si el usuario autenticado es cliente → siempre usa su propio ID
    if (req.user.role === "cliente") {
      finalClientId = req.user.id;
    }

    // Lógica para limitar una cita por cliente
    const existingPendingAppointment = await Appointment.findOne({
      clientId: finalClientId,
      status: "pendiente",
    });

    if (existingPendingAppointment) {
      return res.status(400).json({
        message: "Ya tienes una cita pendiente. Cancela la anterior para agendar una nueva.",
      });
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

     // si es admin, respeta el status enviado
    let appointmentStatus = "pendiente"; // por defecto
    if (req.user.role === "admin" && status) {
      appointmentStatus = status; 
    }

    // Crear la cita
    const newAppointment = new Appointment({
      clientId: finalClientId,
      employeeId,
      serviceId,
      dateTime,
      status: appointmentStatus,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Cita creada correctamente",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la cita", error: error.message });
  }
};

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
    res.status(500).json({ message: "Error al obtener citas", error: error.message });
  }
};


const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Estados válidos
    const allowedStatuses = ["pendiente", "completada", "cancelada"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    // Buscar cita
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // Definir transiciones permitidas
    const allowedTransitions = {
      pendiente: ["completada", "cancelada"],
      completada: [], // no se puede cambiar
      cancelada: ["pendiente"]   // no puede cambiar a completada
    };

    // Validar transición
    if (!allowedTransitions[appointment.status].includes(status)) {
      return res.status(409).json({
        message: "No se pudo actualizar, la cita ya fue actualizada.",
      });
    }

    // Actualizar
    appointment.status = status;
    appointment.updatedBy = req.user.id; // opcional: auditar quién hizo el cambio
    await appointment.save();

    res.status(200).json({
      message: "Estado actualizado correctamente",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cita", error: error.message });
  }
};

  //Eliminar una cita (solo admin)
  const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    await appointment.deleteOne();
    res.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cita", error: error.message });
  }
};

// Obtener estadísticas de citas por estado
const getAppointmentStats = async (req, res) => {
  try {
    // Total
    const totalAppointments = await Appointment.countDocuments();

    // Por estado
    const statusStats = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formattedStatus = {
      pending: 0,
      completed: 0,
      cancelled: 0,
    };

    statusStats.forEach(stat => {
      if (stat._id === "pendiente") formattedStatus.pending = stat.count;
      if (stat._id === "completada") formattedStatus.completed = stat.count;
      if (stat._id === "cancelada") formattedStatus.cancelled = stat.count;
    });

    // Por servicio
const serviceStats = await Appointment.aggregate([
  {
    $group: {
      _id: "$serviceId",
      count: { $sum: 1 }
    }
  },
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
      service: "$service.name",  // <-- usar "service" en lugar de "name"
      count: 1
    }
  },
  { $sort: { count: -1 } } // opcional para ordenar de más usado a menos
]);

    // Por mes
    const monthlyStats = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: "$dateTime" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = [
      "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const formattedMonthly = monthlyStats.map(m => ({
      month: monthNames[m._id],
      count: m.count
    }));

    res.json({
      totalAppointments,
      status: formattedStatus,
      services: serviceStats,
      monthly: formattedMonthly
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStats,
};

