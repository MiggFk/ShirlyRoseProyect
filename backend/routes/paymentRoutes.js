const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // asegúrate que exista
const { createCheckout, mockPay, getIntent } = require("../controllers/paymentController");

// Ahora require login para iniciar checkout (solo usuarios autenticados pueden crear cita)
router.post("/checkout", authMiddleware, createCheckout);

// Mock/pay puede quedar accesible para pruebas (o también proteger si prefieres)
router.post("/mock/pay", mockPay);

router.get("/intent/:id", getIntent);

module.exports = router;