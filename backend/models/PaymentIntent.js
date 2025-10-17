    const mongoose = require("mongoose");

    const paymentIntentSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true },
        currency: { type: String, default: "COP" },
        status: {
        type: String,
        enum: ["created", "pending", "succeeded", "failed", "expired"],
        default: "created",
        },
        expiresAt: { type: Date, required: true }, // TTL
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        customer: {
        name: String,
        email: String,
        phone: String,
        notes: String,
        },
        cart: { type: Array, default: [] }, // snapshot
        appointment: {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        dateTime: { type: Date, required: true },
        // 👇 NUEVO: duración para evaluar solapamientos
        durationMinutes: { type: Number, default: 30 },
        },
        // idempotencia: se completan al confirmar
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", default: null },
        invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", default: null },
    },
    { timestamps: true }
    );

    // TTL: elimina documentos al pasar expiresAt
    paymentIntentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    // Para búsquedas por slot/empleado
    paymentIntentSchema.index({ "appointment.employeeId": 1, "appointment.dateTime": 1, status: 1 });

    module.exports = mongoose.model("PaymentIntent", paymentIntentSchema);