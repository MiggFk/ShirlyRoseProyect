const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware"); // <-- Importado

const { createAppointment, getAppointments, updateAppointmentStatus } = require("../controllers/appointmentController");

// POST: para que un cliente o admin pueda crear una nueva cita
router.post("/", auth, authorizeRoles("cliente", "admin"), createAppointment);

// GET: Listar citas (ahora también debería tener un control de roles)
router.get("/", auth, authorizeRoles("cliente", "admin"), getAppointments); // <-- Ejemplo para getAppointments

// PUT: Actualizar el estado de una cita (quizá solo para admins o empleados)
router.put("/:id/status", auth, authorizeRoles("admin", "empleado"), updateAppointmentStatus);

module.exports = router;