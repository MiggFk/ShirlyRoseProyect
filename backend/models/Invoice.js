const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment"
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Invoice", invoiceSchema);
