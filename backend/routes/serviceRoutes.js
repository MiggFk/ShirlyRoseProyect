const express = require("express");
const router = express.Router();

// Importar los controladores
const { createService, getServices } = require("../controllers/serviceController");

// Ruta para crear un nuevo servicio
router.post("/", createService);

// Ruta para obtener todos los servicios
router.get("/", getServices);

module.exports = router;
