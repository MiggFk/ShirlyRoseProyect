// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId || decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
