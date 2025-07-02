const express = require("express");
const router = express.Router();

// Importamos el controlador
const { registerUser } = require("../controllers/authController");

// Ruta POST para registrar un usuario
router.post("/register", registerUser);

module.exports = router;
