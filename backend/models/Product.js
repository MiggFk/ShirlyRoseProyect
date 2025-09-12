const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        trim: true, // Elimina espacios en blanco al inicio y final
        unique: true, // Asegura que no haya productos con el mismo nombre
        maxlength: [100, "El nombre no puede tener más de 100 caracteres"]
    },
    description: {
        type: String,
        maxlength: [500, "La descripción no puede tener más de 500 caracteres"]
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser un valor negativo"]
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser un valor negativo"],
        default: 0
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/150",
        // Aquí podrías agregar un validador personalizado para URL
        // Por ejemplo: validate: { validator: (v) => /regex/.test(v), message: 'URL de imagen no válida' }
    },
    category: {
        type: String,
        trim: true,
        default: "General"
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt
});

module.exports = mongoose.model("Product", productSchema);