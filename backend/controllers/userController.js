const Client = require("../models/Client");
const User = require("../models/User");

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
        telefono: client?.telefono || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
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

    // Verificar si ya existe el correo
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Crear usuario
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

// 🔹 Actualizar usuario completo (nombre, email, rol)
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  deleteUser,
  updateUser, 
  createUser,
};
