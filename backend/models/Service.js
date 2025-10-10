const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del servicio es obligatorio"],
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
    duration: {
        type: String,
        required: [true, "La duración es obligatoria"],
        enum: [
            '30_min',
            '45_min', 
            '1_hora',
            '1_hora_30_min',
            '2_horas',
            '2_horas_30_min',
            '3_horas',
            '3_horas_30_min',
            '4_horas',
            'mas_4_horas'
        ],
        default: "1_hora"
    },
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
            'manicure_pedicure',
            'tratamientos_faciales', 
            'depilacion',
            'masajes',
            'maquillaje_eventos',
            'tratamientos_cabello'
        ],
        default: "manicure_pedicure"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Service", serviceSchema);
