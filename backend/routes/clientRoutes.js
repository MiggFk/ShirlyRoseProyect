const express = require("express");
const router = express.Router();

// Importar el controlador
const { createClient } = require("../controllers/clientController");

// Ruta para crear cliente
router.post("/", createClient);

module.exports = router;
