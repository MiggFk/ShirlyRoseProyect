const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "cliente", "empleado"],
    required: true
  },
  // 🔹 CAMBIO: De String simple a objeto con url y public_id
  profileImage: {
    url: { type: String, default: null },
    public_id: { type: String, default: null }
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    street: { type: String, default: null },
    city: { type: String, default: null },
    postalCode: { type: String, default: null }
  },
  birthDate: {
    type: Date,
    default: null
  },
  // 🆕 Campo para activar/desactivar usuario
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware pre-save para encriptar contraseñas automáticamente
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada o es nueva
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);