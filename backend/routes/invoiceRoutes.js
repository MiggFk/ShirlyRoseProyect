const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");


//Importar controladores
const { createInvoice, getInvoices } = require("../controllers/invoiceController");

// Ruta para crear factura
//Auth es el middleware (seguridad)
router.post("/", auth, createInvoice);
// Obtener todas las facturas
router.get("/", auth, getInvoices);

module.exports = router;
