const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware"); // <-- Importado

const { createAppointment, getAppointments, updateAppointmentStatus, deleteAppointment, getAppointmentStats } = require("../controllers/appointmentController");

// POST: para que un cliente o admin pueda crear una nueva cita
router.post("/", auth, authorizeRoles("cliente", "admin"), createAppointment);

// GET: Listar citas (ahora también debería tener un control de roles)
router.get("/", auth, authorizeRoles("cliente", "admin"), getAppointments); // <-- Ejemplo para getAppointments

// PUT: Actualizar el estado de una cita (quizá solo para admins o empleados)
router.put("/:id/status", auth, authorizeRoles("admin", "empleado"), updateAppointmentStatus);

// DELETE: Eliminar una cita (solo admin)
router.delete("/:id", auth, authorizeRoles("admin"), deleteAppointment);

// GET: Obtener estadísticas de citas por estado (solo admin)
router.get("/stats", auth, authorizeRoles("admin"), getAppointmentStats);

module.exports = router;