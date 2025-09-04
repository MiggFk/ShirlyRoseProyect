const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { createAppointment, getAppointments, updateAppointmentStatus } = require("../controllers/appointmentController");

// POST: para crear una nueva cita
router.post("/", createAppointment);

// GET: Listar todas las citas
router.get("/", auth, getAppointments);

// PUT: Actualizar el estado de una cita
router.put("/:id", auth, updateAppointmentStatus);

module.exports = router;
