const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  telefono: {
    type: String,
    required: false, // No es obligatorio
    default: null // Permitir nulo inicialmente
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Client", clientSchema);
