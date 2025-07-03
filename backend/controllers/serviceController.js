const Service = require("../models/Service");

const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;

    const newService = new Service({
      name,
      description,
      price,
      duration,
      category
    });

    await newService.save();

    res.status(201).json({
      message: "Servicio creado correctamente",
      service: newService
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear servicio", error });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener servicios", error });
  }
};

module.exports = {
  createService,
  getServices
};
