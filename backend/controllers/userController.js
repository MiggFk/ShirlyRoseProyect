const Client = require("../models/Client");
const User = require("../models/User");

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
        telefono: client?.telefono || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};

module.exports = {
    getProfile
}