const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Client = require("../models/Client");
const { sendVerificationEmail } = require("../config/emailService");

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 📝 REGISTRO CON VERIFICACIÓN
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email inválido" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
    }

    // Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Rol por defecto
    const allowedRoles = ["admin", "empleado", "cliente"];
    const finalRole = allowedRoles.includes(role) ? role : "cliente";

    // 🔹 Generar token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Crear usuario
    const newUser = new User({
      name,
      email,
      password, // Se encripta automáticamente con el middleware
      role: finalRole,
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    await newUser.save();

    // Si es cliente, crear en tabla clients
    if (finalRole === "cliente") {
      await Client.create({
        usuarioId: newUser._id,
        telefono: null,
      });
    }

    // 📧 Enviar email de verificación
    try {
      await sendVerificationEmail(newUser, verificationToken);
      console.log('✅ Email de verificación enviado a:', email);
    } catch (emailError) {
      console.warn('⚠️ No se pudo enviar el email de verificación:', emailError.message);
    }

    res.status(201).json({
      message: "Usuario registrado. Por favor verifica tu email para activar tu cuenta.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified
      }
    });

  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// 🔑 LOGIN (CON VERIFICACIÓN DE EMAIL)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 🔹 VERIFICAR SI EL EMAIL ESTÁ VERIFICADO
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Por favor verifica tu email antes de iniciar sesión",
        needsVerification: true,
        email: user.email
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// ✅ VERIFICAR EMAIL
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Token inválido o expirado. Solicita un nuevo email de verificación.",
        expired: true
      });
    }

    // Marcar como verificado
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ 
      message: "✅ Email verificado exitosamente. Ahora puedes iniciar sesión.",
      success: true
    });

  } catch (error) {
    console.error("❌ Error al verificar email:", error);
    res.status(500).json({ message: "Error al verificar email", error: error.message });
  }
};

// 🔄 REENVIAR EMAIL DE VERIFICACIÓN
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email es obligatorio" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Este email ya está verificado" });
    }

    // Generar nuevo token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Enviar email
    try {
      await sendVerificationEmail(user, verificationToken);
      res.json({ 
        message: "Email de verificación reenviado exitosamente",
        success: true 
      });
    } catch (emailError) {
      console.error('❌ Error al enviar email:', emailError);
      res.status(500).json({ message: "Error al enviar el email" });
    }

  } catch (error) {
    console.error("❌ Error al reenviar email:", error);
    res.status(500).json({ message: "Error al reenviar email", error: error.message });
  }
};

// 📤 OBTENER USUARIO AUTENTICADO
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerificationEmail,
  // 🔹 Mantener compatibilidad con código antiguo (si lo necesitas)
  registerUser: register,
  loginUser: login
};
