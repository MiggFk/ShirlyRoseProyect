const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

//Importar controladores
const { createProduct, getProducts, deleteProduct, updateProduct } = require("../controllers/productController");

//Rutas
// GET: Público
router.get("/", getProducts);
// POST: Solo empleados y admin
router.post("/", auth, authorizeRoles("admin", "empleado"), createProduct);

// Nuevas rutas protegidas:
router.put("/:id", auth, authorizeRoles("admin", "empleado"), updateProduct);
router.delete("/:id", auth, authorizeRoles("admin"), deleteProduct);

module.exports = router;