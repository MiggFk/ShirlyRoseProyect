const express = require("express");
const router = express.Router();
const { upload } = require('../config/cloudinary');

const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getServices,
  getServiceById,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  reactivateService,
  permanentDeleteService,
  deleteServiceImage,
} = require("../controllers/serviceController");

// 🌐 RUTAS PÚBLICAS (sin autenticación)
router.get("/", getServices);                    // Solo servicios activos
router.get("/:id", getServiceById);             // Solo servicios activos

// 🔐 RUTAS ADMIN (requieren autenticación)
router.get("/admin/all", auth, authorizeRoles("admin", "empleado"), getAllServicesAdmin);
router.post("/", auth, authorizeRoles("admin", "empleado"), upload.array('images', 5), createService);
router.put("/:id", auth, authorizeRoles("admin", "empleado"), upload.array('images', 5), updateService);
router.delete("/:id", auth, authorizeRoles("admin", "empleado"), deleteService);
router.patch("/:id/reactivate", auth, authorizeRoles("admin", "empleado"), reactivateService);
router.delete("/:id/permanent", auth, authorizeRoles("admin"), permanentDeleteService);
router.delete("/:serviceId/images/:imageId", auth, authorizeRoles("admin", "empleado"), deleteServiceImage);

module.exports = router;