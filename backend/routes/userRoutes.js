const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");

const {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
  getUserAppointments,
  toggleUserStatus
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Configurar Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

// 👤 Rutas de perfil (usuario autenticado)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("profileImage"), updateProfile);
router.get("/profile/appointments", authMiddleware, getUserAppointments);

// 🔐 Rutas de administración (solo admin)
router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.post("/", authMiddleware, roleMiddleware("admin"), createUser);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);
router.patch("/:id/toggle-status", authMiddleware, roleMiddleware("admin"), toggleUserStatus);

module.exports = router;