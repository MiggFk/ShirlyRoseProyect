const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../config/emailService');
const { 
  register, 
  login, 
  getMe
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Validar que el email existe
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'El email es requerido' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Generar token de verificación ANTES de crear el usuario
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas

    // Crear el usuario con todos los datos
    const user = new User({
      name,
      email: email.trim().toLowerCase(), // Limpiar y normalizar
      password, // Se hasheará automáticamente por el pre-save
      role: 'cliente',
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpires: tokenExpires
    });

    await user.save();

    console.log('✅ Usuario creado:', {
      email: user.email,
      token: verificationToken,
      expires: new Date(tokenExpires),
      isVerified: user.isVerified
    });

    // Enviar email de verificación
    try {
      console.log('📧 Preparando envío de email...');
      console.log('Destinatario:', user.email);
      console.log('Nombre:', user.name);
      console.log('Token:', verificationToken);
      
      await emailService.sendVerificationEmail(
        user.email,  // ⬅️ IMPORTANTE: usar user.email del objeto guardado
        user.name,
        verificationToken
      );
      
      console.log('✅ Email de verificación enviado a:', user.email);
    } catch (emailError) {
      console.error('❌ Error al enviar email:', emailError);
      // No fallar el registro si el email falla
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si el email está verificado
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Por favor verifica tu email antes de iniciar sesión',
        needsVerification: true 
      });
    }

    // Comparar contraseñas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// VERIFICAR EMAIL
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    console.log('🔍 Token recibido:', token);

    // Buscar usuario con ese token y que no haya expirado
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    console.log('🔍 Usuario encontrado:', user ? `${user.email} (verificado: ${user.isVerified})` : 'NO');

    if (!user) {
      console.log('❌ Usuario no encontrado o token expirado');
      return res.status(400).json({ 
        message: 'Token de verificación inválido o expirado. Por favor, solicita un nuevo enlace.' 
      });
    }

    // Si ya está verificado
    if (user.isVerified) {
      console.log('⚠️ Email ya verificado');
      return res.status(400).json({ 
        message: 'Este email ya está verificado. Puedes iniciar sesión.' 
      });
    }

    // Verificar el email
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log('✅ Email verificado exitosamente para:', user.email);

    res.json({ 
      message: '¡Email verificado exitosamente! Ya puedes iniciar sesión.' 
    });

  } catch (error) {
    console.error('❌ Error en verificación de email:', error);
    res.status(500).json({ 
      message: 'Error al verificar el email' 
    });
  }
});

// REENVIAR VERIFICACIÓN
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('📧 Reenviar verificación para:', email);

    // Buscar usuario
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'No se encontró un usuario con ese email' 
      });
    }

    console.log('🔍 Usuario encontrado - isVerified:', user.isVerified);

    if (user.isVerified) {
      return res.status(400).json({ 
        message: 'Este email ya está verificado. Puedes iniciar sesión.' 
      });
    }

    // Generar nuevo token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
    await user.save();

    console.log('✅ Nuevo token generado:', verificationToken);

    // Reenviar email
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);

    console.log('✅ Email reenviado a:', user.email);

    res.json({ 
      message: 'Email de verificación reenviado. Revisa tu bandeja de entrada.' 
    });

  } catch (error) {
    console.error('❌ Error al reenviar verificación:', error);
    res.status(500).json({ 
      message: 'Error al reenviar email de verificación' 
    });
  }
});

// Obtener usuario autenticado
router.get("/me", authMiddleware, getMe);

module.exports = router;
