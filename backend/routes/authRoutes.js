const express = require("express");
const router = express.Router();

// Importamos el controlador
const { registerUser, loginUser  } = require("../controllers/authController");

// Ruta POST para registrar un usuario
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

module.exports = router;
