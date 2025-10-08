# 🌹 Shirly Rose Project

Sistema de gestión completo para salón de belleza desarrollado con tecnologías modernas. Incluye gestión de citas, clientes, servicios, productos, facturación y panel administrativo.

## 🚀 Características

### Frontend
- ✨ Interfaz moderna y responsiva
- 🎨 Diseño con Tailwind CSS
- 📱 Optimizado para dispositivos móviles
- 🔐 Sistema de autenticación de usuarios
- 📊 Dashboard administrativo

### Backend
- 🛡️ API RESTful con Express.js
- 🗄️ Base de datos MongoDB
- 🔒 Autenticación JWT
- 📧 Sistema de notificaciones
- 🧾 Generación de facturas

### Funcionalidades Principales
- 👥 **Gestión de Clientes**: Registro con validación de teléfono
- 📅 **Sistema de Citas**: Programación y gestión de citas
- 💇‍♀️ **Servicios**: Catálogo completo de servicios de belleza
- 🛍️ **Productos**: Inventario y gestión de productos
- 🧾 **Facturación**: Sistema completo de facturación
- 👨‍💼 **Panel Admin**: Gestión completa desde el dashboard

## 🛠️ Tecnologías Utilizadas

### Frontend
- React.js
- Tailwind CSS
- PostCSS
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- bcrypt (encriptación de contraseñas)
- CORS
- dotenv

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- [Git](https://git-scm.com/)

## ⚡ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd ShirlyRoseProyect
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta backend:
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/shirlyrose
# o para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/shirlyrose

# JWT
JWT_SECRET=tu_jwt_secret_aqui
JWT_EXPIRES_IN=7d

# Servidor
PORT=5000
NODE_ENV=development

# Otros servicios (opcional)
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_app
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

### 4. Iniciar el proyecto

#### Desarrollo (Backend y Frontend por separado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# o
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Producción
```bash
# En la carpeta frontend
npm run build

# Luego iniciar solo el backend (servirá los archivos estáticos)
cd ../backend
npm start
```

## 📁 Estructura del Proyecto

```
ShirlyRoseProyect/
├── backend/
│   ├── config/
│   │   └── db.js                 # Configuración de base de datos
│   ├── controllers/
│   │   ├── appointmentController.js  # Lógica de citas
│   │   ├── authController.js         # Autenticación
│   │   ├── clientController.js       # Gestión de clientes
│   │   ├── invoiceController.js      # Facturación
│   │   ├── productController.js      # Productos
│   │   ├── serviceController.js      # Servicios
│   │   └── userController.js         # Usuarios (Admin)
│   ├── middleware/              # Middlewares personalizados
│   ├── models/                  # Modelos de MongoDB
│   ├── routes/                  # Rutas de la API
│   ├── .env                     # Variables de entorno
│   ├── index.js                 # Punto de entrada del servidor
│   └── package.json
├── frontend/
│   ├── public/                  # Archivos públicos
│   ├── src/                     # Código fuente React
│   ├── build/                   # Archivos compilados
│   ├── tailwind.config.js       # Configuración Tailwind
│   ├── postcss.config.js        # Configuración PostCSS
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Citas
- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Cancelar cita

### Servicios
- `GET /api/services` - Listar servicios
- `POST /api/services` - Crear servicio
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Facturación
- `GET /api/invoice` - Listar facturas
- `POST /api/invoice` - Crear factura
- `GET /api/invoice/:id` - Obtener factura específica

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Autenticación JWT
- ✅ Validación de datos de entrada
- ✅ Configuración CORS
- ✅ Variables de entorno para datos sensibles

## 🚀 Despliegue

### Frontend (Netlify/Vercel)
1. Construir el proyecto: `npm run build`
2. Subir la carpeta `build/` a tu servicio de hosting

### Backend (Heroku/Railway/DigitalOcean)
1. Configurar variables de entorno en tu plataforma
2. Asegurar que MongoDB Atlas esté configurado
3. Desplegar desde el directorio `backend/`

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Notas de Desarrollo

- El servidor backend corre en puerto 5000 por defecto
- El frontend se conecta automáticamente al backend
- Usar `npm run dev` en backend para desarrollo con nodemon
- Las rutas de la API están prefijadas con `/api`

## 📧 Contacto

Para más información sobre el proyecto, contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto es privado y pertenece a Shirly Rose Beauty Salon.

---

⭐ **¡Dale una estrella si te gusta el proyecto!**