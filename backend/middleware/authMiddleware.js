// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario
    const user = await User.findById(decoded.id || decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Guardar usuario en req para usarlo en las rutas
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error("❌ Error en authMiddleware:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
