const express = require("express");
const router = express.Router();
const { upload } = require('../config/cloudinary');

const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getProducts,
  getProductById,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  reactivateProduct,
  permanentDeleteProduct,
} = require("../controllers/productController");

// 🌐 RUTAS PÚBLICAS
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔐 RUTAS ADMIN
router.get("/admin/all", auth, authorizeRoles("admin", "empleado"), getAllProductsAdmin);
router.post("/", auth, authorizeRoles("admin", "empleado"), upload.array('images', 5), createProduct);
router.put("/:id", auth, authorizeRoles("admin", "empleado"), upload.array('images', 5), updateProduct);
router.delete("/:id", auth, authorizeRoles("admin", "empleado"), deleteProduct);
router.patch("/:id/reactivate", auth, authorizeRoles("admin", "empleado"), reactivateProduct);
router.delete("/:id/permanent", auth, authorizeRoles("admin"), permanentDeleteProduct);
router.delete("/:productId/images/:imageId", auth, authorizeRoles("admin", "empleado"), deleteProductImage);

module.exports = router;
