const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { clientId, employeeId, serviceId, dateTime } = req.body;

    // Validar que no sea una fecha pasada
    if (new Date(dateTime) < new Date()) {
      return res.status(400).json({ message: "No se puede agendar una cita en el pasado." });
    }

    // Validar si ya existe una cita con ese empleado en la misma fecha y hora
    const existingAppointment = await Appointment.findOne({
      employeeId,
      dateTime
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "El empleado ya tiene una cita en ese horario." });
    }

    // Crear la cita
    const newAppointment = new Appointment({
      clientId,
      employeeId,
      serviceId,
      dateTime
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Cita creada correctamente",
      appointment: newAppointment
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la cita", error });
  }
};

const getAppointments = async (req, res) => {
  try {
    let filter = {};

    // Si el rol es cliente, filtra solo sus citas
    if (req.user.role === "cliente") {
      filter.clientId = req.user.id;
    }

    const appointments = await Appointment.find(filter)
      .populate("clientId", "name")
      .populate("employeeId", "name email role")
      .populate("serviceId", "name price");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas", error });
  }
};


module.exports = {
  createAppointment,
  getAppointments
};

