const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStats,
} = require("../controllers/appointmentController");

// Rutas públicas/autenticadas
router.post("/", auth, createAppointment);
router.get("/", auth, getAppointments);

// 🔹 ESTA ES LA LÍNEA 16 - Verifica que getAppointmentStats exista
router.get("/stats", auth, authorizeRoles("admin"), getAppointmentStats);

router.put("/:id/status", auth, authorizeRoles("admin"), updateAppointmentStatus);
router.delete("/:id", auth, authorizeRoles("admin"), deleteAppointment);

module.exports = router;