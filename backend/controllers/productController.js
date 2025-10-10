const Product = require("../models/Product");
const { cloudinary } = require('../config/cloudinary');

// 📋 PÚBLICO - Obtener todos los productos activos
const getProducts = async (req, res) => {
  try {
    // Solo productos activos para el público
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

// 📋 PÚBLICO - Obtener un producto por ID (solo activos)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};

// 🔐 ADMIN - Obtener todos los productos (incluye inactivos)
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

// 🔐 ADMIN - Crear producto con imágenes
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Procesar imágenes subidas a Cloudinary
    const images = req.files ? req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    })) : [];

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category,
      images
    });

    await product.save();

    res.status(201).json({ 
      message: "Producto creado correctamente", 
      product 
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
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

// 🔐 ADMIN - Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category
    };

    // Si hay nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      const product = await Product.findById(req.params.id);
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      
      updateData.images = [...(product.images || []), ...newImages];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado correctamente", product });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};

// 🔐 ADMIN - Eliminar producto (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false }, // Soft delete
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};

// 🔐 ADMIN - Eliminar imagen específica
const deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    // Eliminar de Cloudinary
    const imageToDelete = product.images[imageIndex];
    if (imageToDelete.public_id) {
      await cloudinary.uploader.destroy(imageToDelete.public_id);
    }

    // Eliminar del array
    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar imagen", error });
  }
};

// 🔐 ADMIN - Reactivar producto
const reactivateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    
    res.json({ message: "Producto reactivado correctamente", product });
  } catch (error) {
    res.status(500).json({ message: "Error al reactivar producto", error });
  }
};

// 🔐 ADMIN - Eliminar producto PERMANENTEMENTE
const permanentDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar imágenes de Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (cloudinaryError) {
            console.error('Error deleting image from Cloudinary:', cloudinaryError);
          }
        }
      }
    }

    // Eliminar producto de la base de datos
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Producto eliminado permanentemente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto permanentemente", error });
  }
};

module.exports = {
  getProducts,           // Público
  getProductById,        // Público  
  getAllProductsAdmin,   // Admin
  createProduct,         // Admin
  updateProduct,         // Admin
  deleteProduct,         // Admin
  deleteProductImage,    // Admin
  reactivateProduct,        // Admin
  permanentDeleteProduct    // Admin
};
