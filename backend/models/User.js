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
    enum: ["admin", "cliente", "empleado"],  // ← valores en español
    required: true
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
