const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "https://shirlyrose.netlify.app", //  tu dominio del frontend
    "http://localhost:5000" //  para seguir probando en local si usas Vite
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Shirly Rose funcionando");
});

app.use("/api/clients", clientRoutes);  //Ruta de prueba para registrar clientes (telefono)
app.use("/api/auth", authRoutes); //Ruta de prueba para user/registro
app.use("/api/services", serviceRoutes);//Ruta de prueba para agregar servicios
app.use("/api/appointments",appointmentRoutes); //Ruta de prueba para citas
app.use("/api/products", productRoutes); //Ruta de prueba para productos
app.use("/api/invoice", invoiceRoutes);//Ruta de prueba para facturas
app.use("/api/users", userRoutes);//Ruta de prueba para usuarios (recibir datos)

// Escuchar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
