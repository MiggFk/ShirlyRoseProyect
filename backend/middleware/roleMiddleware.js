const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Acceso denegado. Rol insuficiente."
      });
    }

    next(); // Tiene el rol correcto
  };
};

module.exports = authorizeRoles;
