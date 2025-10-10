const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const express = require('express');
const router = express.Router();

// Configurar Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar storage de Multer para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shirlyrose-products', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: (req, file) => {
      // Generar nombre único para cada imagen
      return `product_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    },
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Redimensionar
      { quality: 'auto' } // Optimización automática
    ]
  },
});

// Configurar multer
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo por archivo
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Agregar esta función temporal al final del archivo
const testCloudinary = async (req, res) => {
  try {
    console.log('📁 Files received:', req.files);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se recibieron archivos' });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      original_name: file.originalname
    }));

    res.json({
      message: 'Archivos subidos a Cloudinary correctamente',
      images: uploadedImages
    });
  } catch (error) {
    console.error('❌ Error en test:', error);
    res.status(500).json({ message: 'Error en test', error: error.message });
  }
};

// Agregar esta ruta temporal
router.post('/test-upload', upload.array('images', 5), testCloudinary);

// Test de conexión
console.log('🔧 Cloudinary configurado:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***configurado***' : '❌ falta',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***configurado***' : '❌ falta'
});

module.exports = { cloudinary, upload, testCloudinary };