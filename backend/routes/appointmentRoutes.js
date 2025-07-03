const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { createAppointment, getAppointments } = require("../controllers/appointmentController");

// Ruta para crear una nueva cita
router.post("/", createAppointment);

// GET: Listar todas las citas

router.get("/", auth, getAppointments);


module.exports = router;
