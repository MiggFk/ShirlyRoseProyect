const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar si viene el token en el header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado o mal formado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ahora puedes acceder a req.user en controladores
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
