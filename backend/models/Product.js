const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        trim: true,
        unique: true,
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
    // 🔄 CAMBIO: De una imagen a múltiples imágenes con Cloudinary
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: true,
        enum: [
            'maquillaje', 
            'cuidado_facial', 
            'cuidado_cabello', 
            'cuidado_unas',
            'cuidado_piel',
            'accesorios'
        ],
        default: "maquillaje"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);