require('dotenv').config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Importar rutas
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes"); // ✅
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅
const paymentRoutes = require("./routes/paymentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

// Crear servidor
const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ API Shirly Rose funcionando correctamente");
});

// 🔹 REGISTRAR RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/payments", paymentRoutes); // 👈 NUEVO
app.use("/api/employees", employeeRoutes);

// 🔹 Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ 
    message: "❌ Ruta no encontrada", 
    path: req.originalUrl 
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
