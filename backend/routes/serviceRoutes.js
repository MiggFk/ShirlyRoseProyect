const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Público (sin autenticación)
router.get("/", getServices);
router.get("/:id", getServiceById);

// Protegido (solo admin y empleado)
router.post("/", auth, authorizeRoles("admin", "empleado"), createService);
router.put("/:id", auth, authorizeRoles("admin", "empleado"), updateService);
router.delete("/:id", auth, authorizeRoles("admin", "empleado"), deleteService);

module.exports = router;