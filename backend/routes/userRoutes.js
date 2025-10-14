const express = require("express");
const router = express.Router();
const { upload } = require('../config/cloudinary');

const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { 
  getProfile, 
  getAllUsers, 
  deleteUser, 
  updateUser,
  createUser,
  updateProfile,
  getUserAppointments,
  toggleUserStatus // 🆕 Importar
} = require("../controllers/userController");

// Perfil personal (todos los autenticados)
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single('profileImage'), updateProfile);
router.get("/profile/appointments", auth, getUserAppointments);

// Rutas de administración (solo admin)
router.post("/", auth, authorizeRoles("admin"), createUser);
router.get("/", auth, authorizeRoles("admin"), getAllUsers);
router.delete("/:id", auth, authorizeRoles("admin"), deleteUser);
router.put("/:id", auth, authorizeRoles("admin"), updateUser);
router.patch("/:id/toggle-status", auth, authorizeRoles("admin"), toggleUserStatus); // 🆕 Nueva ruta

module.exports = router;