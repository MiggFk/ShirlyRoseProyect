const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["pendiente", "completada", "cancelada"],
    default: "pendiente"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Appointment", appointmentSchema);


