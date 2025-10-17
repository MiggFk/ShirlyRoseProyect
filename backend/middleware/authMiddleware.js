// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Obtener token del header
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "Acceso denegado. Token no proporcionado." 
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // ✅ Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("❌ Token inválido:", jwtError.message);
      return res.status(401).json({ 
        message: "Token inválido o expirado",
        error: jwtError.message
      });
    }

    // ✅ Buscar usuario
    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // ✅ Adjuntar usuario a request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    next();
    
  } catch (error) {
    console.error("❌ Error en authMiddleware:", error.message);
    res.status(401).json({ 
      message: "Token inválido o expirado",
      error: error.message
    });
  }
};

module.exports = authMiddleware;
