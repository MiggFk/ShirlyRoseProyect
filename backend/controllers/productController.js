const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category
    });

    await newProduct.save();

    res.status(201).json({
      message: "Producto creado correctamente",
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto actualizado correctamente",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};


module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct
};
