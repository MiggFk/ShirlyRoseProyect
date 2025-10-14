const express = require("express");
const router = express.Router();
const { upload } = require('../config/cloudinary'); // ← AGREGAR

const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { 
  getProfile, 
  getAllUsers, 
  deleteUser, 
  updateUser,
  createUser,
  updateProfile,
  getUserAppointments 
} = require("../controllers/userController");

// Perfil personal (todos los autenticados)
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single('profileImage'), updateProfile); // ← CAMBIAR
router.get("/profile/appointments", auth, getUserAppointments);

// Rutas de administración (solo admin)
router.post("/", auth, authorizeRoles("admin"), createUser);
router.get("/", auth, authorizeRoles("admin"), getAllUsers);
router.delete("/:id", auth, authorizeRoles("admin"), deleteUser);
router.put("/:id", auth, authorizeRoles("admin"), updateUser); 

module.exports = router;