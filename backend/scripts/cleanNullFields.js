const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function cleanNullFields() {
  try {
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB\n");

    // Encontrar todos los usuarios con campos null
    const users = await User.find({
      $or: [
        { phone: null },
        { address: null },
        { birthDate: null }
      ]
    });

    console.log(`📊 Usuarios con campos null encontrados: ${users.length}\n`);

    if (users.length === 0) {
      console.log("✅ No hay usuarios con campos null");
      await mongoose.disconnect();
      process.exit(0);
    }

    let updated = 0;

    // Actualizar cada usuario individualmente
    for (const user of users) {
      const updates = {};

      if (user.phone === null) {
        updates.phone = "";
        console.log(`  → Limpiando phone de ${user.email}`);
      }

      if (user.address === null) {
        updates.address = {};
        console.log(`  → Limpiando address de ${user.email}`);
      }

      if (user.birthDate === null) {
        updates.birthDate = undefined;
        console.log(`  → Limpiando birthDate de ${user.email}`);
      }

      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(user._id, { $set: updates });
        updated++;
      }
    }

    console.log(`\n✅ ${updated} usuarios actualizados correctamente`);
    
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Ejecutar el script
cleanNullFields();