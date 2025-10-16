const Client = require("../models/Client");
const User = require("../models/User");
const { cloudinary } = require('../config/cloudinary'); // ← AGREGAR
const bcrypt = require('bcryptjs');

// Perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const client = await Client.findOne({ usuarioId: req.user.id });

    res.status(200).json({
      message: "Perfil cargado correctamente",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address,
        birthDate: user.birthDate,
        telefono: client?.telefono || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};

// 🔹 Actualizar perfil del usuario autenticado
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, birthDate, removeProfileImage } = req.body;

    // Buscar usuario actual
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Preparar datos de actualización
    const updateData = { 
      name, 
      phone, 
      birthDate 
    };

    // Parsear address si viene como string JSON
    if (address) {
      updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
    }

    // 🔹 NUEVA FUNCIONALIDAD: Eliminar imagen si removeProfileImage es true
    if (removeProfileImage === 'true') {
      // Eliminar imagen de Cloudinary si existe
      if (currentUser.profileImage && currentUser.profileImage.public_id) {
        try {
          await cloudinary.uploader.destroy(currentUser.profileImage.public_id);
          console.log('Imagen eliminada de Cloudinary');
        } catch (error) {
          console.error('Error eliminando imagen de Cloudinary:', error);
        }
      }

      // Establecer profileImage como null
      updateData.profileImage = {
        url: null,
        public_id: null
      };
    }
    // 🔹 Si hay nueva imagen, subir a Cloudinary
    else if (req.file) {
      // Eliminar imagen anterior de Cloudinary si existe
      if (currentUser.profileImage && currentUser.profileImage.public_id) {
        try {
          await cloudinary.uploader.destroy(currentUser.profileImage.public_id);
          console.log('Imagen anterior eliminada de Cloudinary');
        } catch (error) {
          console.error('Error eliminando imagen anterior:', error);
        }
      }

      // Guardar nueva imagen
      updateData.profileImage = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ 
      message: "Perfil actualizado correctamente", 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
  }
};

// 🔹 MODIFICAR: Obtener citas del usuario autenticado con más información
const getUserAppointments = async (req, res) => {
  try {
    const Appointment = require("../models/Appointment");
    
    const appointments = await Appointment.find({ clientId: req.user.id })
      .populate({
        path: 'serviceId',
        select: 'name category price duration description' // 🔹 Especificar qué campos traer
      })
      .sort({ dateTime: -1 });

    // 🔹 Debug para ver qué está trayendo
    console.log('📋 Appointments encontradas:', appointments.length);
    if (appointments.length > 0) {
      console.log('🔍 Ejemplo de cita:', {
        id: appointments[0]._id,
        serviceId: appointments[0].serviceId,
        dateTime: appointments[0].dateTime,
        status: appointments[0].status
      });
    }

    res.json({ appointments });
  } catch (error) {
    console.error('❌ Error al obtener citas:', error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
};

// Listar todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Crear nuevo usuario (solo admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

// Eliminar usuario por ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

// 🔹 Actualizar usuario (admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, birthDate, isActive } = req.body;

    const updateData = { 
      name, 
      email, 
      role, 
      phone, 
      birthDate,
      isActive // 🆕 Agregar isActive
    };

    // Parsear address si viene como string JSON
    if (address) {
      updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// 🆕 Activar/Desactivar usuario
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} correctamente`,
      user: {
        ...user.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error cambiando estado del usuario:', error);
    res.status(500).json({ message: "Error al cambiar estado", error: error.message });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
  updateProfile,
  getUserAppointments,
  toggleUserStatus
};