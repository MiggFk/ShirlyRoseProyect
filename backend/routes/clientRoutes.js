const express = require("express");
const router = express.Router();

// Importar el controlador
const { createClient, getClients } = require("../controllers/clientController");

// Ruta para crear cliente
router.post("/", createClient);

// Ruta para obtener todos los clientes
router.get("/", getClients);

module.exports = router;
