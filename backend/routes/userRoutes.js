const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");

// Ruta para obtener el perfil del usuario autenticado
router.get("/profile", auth, getProfile);

module.exports = router;
