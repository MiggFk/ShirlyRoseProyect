const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  telefono: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Client", clientSchema);
