const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStats,
  getAdvancedStats,
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Estadísticas (solo admin)
router.get("/advanced-stats", authMiddleware, roleMiddleware("admin"), getAdvancedStats);
router.get("/stats", authMiddleware, roleMiddleware("admin"), getAppointmentStats);

// Crear cita (cualquier usuario autenticado)
router.post("/", authMiddleware, createAppointment);

// Obtener citas (cualquier usuario autenticado)
router.get("/", authMiddleware, getAppointments);

// Actualizar estado de cita (admin o empleado)
router.patch("/:id", authMiddleware, roleMiddleware("admin", "empleado"), updateAppointmentStatus);

// Eliminar cita (solo admin)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteAppointment);

module.exports = router;