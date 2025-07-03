const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

const createInvoice = async (req, res) => {
  try {
    const { clientId, appointmentId, products } = req.body;

    // Calcular total y validar existencia de productos
    let total = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
      }

      total += item.quantity * product.price;
    }

    // Descontar stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    const newInvoice = new Invoice({
      clientId,
      appointmentId,
      products,
      total
    });

    await newInvoice.save();

    res.status(201).json({
      message: "Factura creada correctamente",
      invoice: newInvoice
    });

  } catch (error) {
    res.status(500).json({ message: "Error al crear factura", error });
  }
};


const getInvoices = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "cliente") {
      filter.clientId = req.user.id;
    }

    const invoices = await Invoice.find(filter)
      .populate("clientId", "telefono")
      .populate("appointmentId")
      .populate("products.productId", "name price");

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener facturas", error });
  }
};


module.exports = {
  createInvoice,
  getInvoices
};
