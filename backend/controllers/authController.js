const User = require("../models/User");
const bcrypt = require("bcrypt");


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
  return res.status(400).json({ message: "El correo ya está registrado" });
 }

// Encriptar la contraseña antes de guardarla
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

module.exports = {
  registerUser
};
