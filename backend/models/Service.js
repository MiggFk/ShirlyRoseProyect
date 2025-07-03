const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  category: String
}, {
  timestamps: true
});

module.exports = mongoose.model("Service", serviceSchema);
