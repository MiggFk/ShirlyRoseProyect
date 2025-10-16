const User = require("../models/User");

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(" o ")}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error al verificar rol", error: error.message });
    }
  };
};

module.exports = authorizeRoles;
