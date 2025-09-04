const User = require("../models/User");
const Client = require("../models/Client"); // 🔥 IMPORTANTE: faltaba esto
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si existe el usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Correo no registrado" });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = "cliente";

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

    // Crear documento en clients también
    await Client.create({
      userId: newUser._id,
      telefono: null // valor por defecto
    });

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
    console.error("Error en registerUser:", error); // 🔥 log útil para debug
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};
