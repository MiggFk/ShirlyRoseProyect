const Service = require("../models/Service");
const { cloudinary } = require('../config/cloudinary');

// 📋 PÚBLICO - Obtener todos los servicios activos
const getServices = async (req, res) => {
  try {
    // Solo servicios activos para el público
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener servicios", error });
  }
};

// 📋 PÚBLICO - Obtener un servicio por ID (solo activos)
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el servicio", error });
  }
};

// 🔐 ADMIN - Obtener todos los servicios (incluye inactivos)
const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener servicios", error });
  }
};

// 🔐 ADMIN - Crear servicio con imágenes
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;

    // Procesar imágenes subidas a Cloudinary
    const images = req.files ? req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    })) : [];

    const service = new Service({
      name,
      description,
      price: parseFloat(price),
      duration,
      category,
      images
    });

    await service.save();

    res.status(201).json({ 
      message: "Servicio creado correctamente", 
      service 
    });
  } catch (error) {
    // Si hay error, eliminar imágenes de Cloudinary
    if (req.files) {
      for (const file of req.files) {
        try {
          await cloudinary.uploader.destroy(file.filename);
        } catch (deleteError) {
          console.error('Error deleting image from Cloudinary:', deleteError);
        }
      }
    }
    res.status(500).json({ message: "Error al crear servicio", error });
  }
};

// 🔐 ADMIN - Actualizar servicio
const updateService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      duration,
      category
    };

    // Si hay nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      const service = await Service.findById(req.params.id);
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      
      updateData.images = [...(service.images || []), ...newImages];
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// 🔐 ADMIN - Eliminar servicio (soft delete)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false }, // Soft delete
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    
    res.json({ message: "Servicio desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar servicio", error });
  }
};

// 🔐 ADMIN - Reactivar servicio
const reactivateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    
    res.json({ message: "Servicio reactivado correctamente", service });
  } catch (error) {
    res.status(500).json({ message: "Error al reactivar servicio", error });
  }
};

// 🔐 ADMIN - Eliminar servicio PERMANENTEMENTE
const permanentDeleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    // Eliminar imágenes de Cloudinary
    if (service.images && service.images.length > 0) {
      for (const image of service.images) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (cloudinaryError) {
            console.error('Error deleting image from Cloudinary:', cloudinaryError);
          }
        }
      }
    }

    // Eliminar servicio de la base de datos
    await Service.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Servicio eliminado permanentemente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar servicio permanentemente", error });
  }
};

// 🔐 ADMIN - Eliminar imagen específica
const deleteServiceImage = async (req, res) => {
  try {
    const { serviceId, imageId } = req.params;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    const imageIndex = service.images.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    // Eliminar de Cloudinary
    const imageToDelete = service.images[imageIndex];
    if (imageToDelete.public_id) {
      await cloudinary.uploader.destroy(imageToDelete.public_id);
    }

    // Eliminar del array
    service.images.splice(imageIndex, 1);
    await service.save();

    res.json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar imagen", error });
  }
};

module.exports = {
  getServices,           // Público
  getServiceById,        // Público  
  getAllServicesAdmin,   // Admin
  createService,         // Admin
  updateService,         // Admin
  deleteService,         // Admin
  reactivateService,     // Admin
  permanentDeleteService,// Admin
  deleteServiceImage     // Admin
};