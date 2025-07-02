const Client = require("../models/Client");

const createClient = async (req, res) => {
  try {
    const { usuarioId, telefono } = req.body;

    // Verificar si ya existe un cliente con ese usuario
    const existingClient = await Client.findOne({ usuarioId });
    if (existingClient) {
      return res.status(400).json({ message: "Este usuario ya tiene un perfil de cliente." });
    }

    const newClient = new Client({
      usuarioId,
      telefono
    });

    await newClient.save();

    res.status(201).json({
      message: "Cliente creado correctamente",
      client: newClient
    });

  } catch (error) {
    res.status(500).json({ message: "Error al crear cliente", error });
  }
};

module.exports = {
  createClient
};
