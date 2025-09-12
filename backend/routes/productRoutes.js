const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Público
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protegido (solo admin y empleado)
router.post("/", auth, authorizeRoles("admin", "empleado"), createProduct);
router.put("/:id", auth, authorizeRoles("admin", "empleado"), updateProduct);
router.delete("/:id", auth, authorizeRoles("admin", "empleado"), deleteProduct);

module.exports = router;
