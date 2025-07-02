const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);  // Detiene el servidor si falla
  }
};

module.exports = connectDB;


//Aqui se maneja la conexion de mongo, ahorrando codigo en index.js y teniendo escalabilidad a futuro