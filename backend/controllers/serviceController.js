const Service = require("../models/Service");

// Obtener todos los servicios (público)
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener servicios", error });
  }
};

// Obtener un servicio por ID (público)
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el servicio", error });
  }
};

// Crear servicio (admin/empleado)
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;

    const service = new Service({ name, description, price, duration, category });
    await service.save();

    res.status(201).json({ message: "Servicio creado correctamente", service });
  } catch (error) {
    res.status(500).json({ message: "Error al crear servicio", error });
  }
};

// Actualizar servicio (admin/empleado)
const updateService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, price, duration, category },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    res.json({ message: "Servicio actualizado correctamente", service });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar servicio", error });
  }
};

// Eliminar servicio (admin/empleado)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    res.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar servicio", error });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};