const Product = require("../models/Product");

// Obtener todos los productos (público)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

// Obtener un producto por ID (público)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};

// Crear producto (admin/empleado)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image, category } = req.body;

    const product = new Product({ name, description, price, stock, image, category });
    await product.save();

    res.status(201).json({ message: "Producto creado correctamente", product });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

// Actualizar producto (admin/empleado)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image, category } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, image, category },
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

// Eliminar producto (admin/empleado)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
