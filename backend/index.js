const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Shirly Rose funcionando");
});

app.use("/api/clients", clientRoutes);  //Ruta de prueba para client

app.use("/api/auth", authRoutes); //Ruta de prueba para user/registro

// Escuchar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
