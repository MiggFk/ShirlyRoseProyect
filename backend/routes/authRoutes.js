const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  getMe,
  verifyEmail,
  resendVerificationEmail
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Registro y login
router.post("/register", register);
router.post("/login", login);

// 🆕 Verificación de email
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// Obtener usuario autenticado
router.get("/me", authMiddleware, getMe);

module.exports = router;
