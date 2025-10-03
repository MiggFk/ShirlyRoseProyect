// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token, autorización denegada" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 buscar el usuario completo
    const user = await User.findById(decoded.id).select("name email role");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log("✅ Usuario autenticado:", req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = auth;
