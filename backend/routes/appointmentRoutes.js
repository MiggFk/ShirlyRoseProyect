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

// 📊 Estadísticas (solo admin)
router.get("/advanced-stats", authMiddleware, roleMiddleware("admin"), getAdvancedStats);
router.get("/stats", authMiddleware, roleMiddleware("admin"), getAppointmentStats);

// 📅 CRUD de citas
router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, getAppointments);
router.patch("/:id", authMiddleware, roleMiddleware("admin", "empleado"), updateAppointmentStatus);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteAppointment);

module.exports = router;