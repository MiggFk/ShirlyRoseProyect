const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔹 Responder con el objeto completo incluyendo profile
    res.json({
      profile: user  // ← Envolver en "profile" para que coincida con el frontend
    });
  } catch (error) {
    console.error("❌ Error al obtener perfil:", error);
    res.status(500).json({ message: "Error al obtener perfil", error: error.message });
  }
};

// Actualizar perfil del usuario autenticado
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, birthDate } = req.body;

    // ✅ Construir objeto de actualización solo con campos válidos
    const updateData = {};
    
    if (name && name.trim()) updateData.name = name.trim();
    if (phone && phone.trim()) updateData.phone = phone.trim();
    if (address && address.trim()) updateData.address = address.trim();
    if (birthDate && birthDate.trim()) updateData.birthDate = birthDate.trim();
    
    // ✅ Agregar imagen si viene en la request
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    // ✅ Actualizar solo los campos que tienen valor
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },  // Solo campos con valor
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
        address: user.address || null,
        birthDate: user.birthDate || null,
        profileImage: user.profileImage || null,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ 
      message: "Error al actualizar perfil", 
      error: error.message 
    });
  }
};

// Obtener todos los usuarios (solo admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Crear usuario (solo admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'cliente',
      isVerified: true
    });

    await user.save();

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

// Actualizar usuario (solo admin)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: "Usuario actualizado exitosamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// Eliminar usuario (solo admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

// Obtener citas del usuario
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ clientId: req.user.id })
      .populate('serviceId')
      .populate('employeeId', 'name')
      .sort({ dateTime: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    res.status(500).json({ message: "Error al obtener citas", error: error.message });
  }
};

// Activar/desactivar usuario
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
      user: {
        id: user._id,
        name: user.name,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ message: "Error al cambiar estado del usuario", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserAppointments,
  toggleUserStatus
};