const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    enum: ["pending", "completed", "canceled"],
    default: "pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Appointment", appointmentSchema);


