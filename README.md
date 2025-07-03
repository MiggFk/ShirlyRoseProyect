# 💇‍♀️ Shirly Rose - Sistema de Agendamiento y Facturación

Proyecto académico SENA para automatizar la gestión de citas, clientes, productos y facturas de un local de peluquería y estética.

---

## 🚀 Tecnologías utilizadas

- **Frontend:** React (HTML, CSS, JavaScript)
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB + Mongoose
- **Seguridad:** JWT, Bcrypt
- **Control de versiones:** Git y GitHub
- **Otros:** Dotenv, Cors, Nodemon

---

## 📁 Estructura del Proyecto

ShirlyRose/
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── config/
│ ├── index.js
│ └── .env
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
└── README.md


---

## 🧩 Módulos del Backend

### ✅ Autenticación
- Registro con contraseña encriptada (bcrypt)
- Login con token JWT
- Protección de rutas con middleware `authMiddleware`
- Protección por rol con `roleMiddleware`
- Ruta `/api/users/profile`

### ✅ Usuarios y Clientes
- Modelo `User`: nombre, email, password, rol
- Modelo `Client`: teléfono, usuarioId
- Roles disponibles: `admin`, `empleado`, `cliente`

### ✅ Servicios
- Crear y listar servicios
- Campos: nombre, precio, duración

### ✅ Citas (`/api/appointments`)
- Crear y listar citas
- Validación de disponibilidad
- Clientes ven solo sus citas
- Admin y empleados ven todas

### ✅ Productos (`/api/products`)
- CRUD completo
- Ver todos (público)
- Crear, editar (empleado/admin)
- Eliminar (solo admin)

### ✅ Facturas (`/api/invoice`)
- Registrar ventas con productos y citas
- Descuenta stock automáticamente
- Clientes ven solo sus facturas

---

## 🔐 Seguridad

- Contraseñas cifradas
- Tokens JWT
- Protección de rutas
- Control de roles

---

## 📦 Instalación y ejecución

1. Clona el proyecto:
   ```bash
   git clone https://github.com/MiggFk/ShirlyRoseProyect.git

2. instala dependencias: 
   cd backend
   npm install
   cd ../frontend
   npm install

3. Crea el archivo .env en backend/:
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_secreto

4. inicia el backend: 
   npm run dev

5. inicia el backend: 
   npm start

 ## ✅ Estado actual del backend
 ✅ Usuarios

 ✅ Autenticación con roles

 ✅ CRUD de citas

 ✅ CRUD de productos

 ✅ Facturación con control de stock

 ✅ Seguridad con JWT

 ✅ Rutas protegidas por rol

 ## Autores
 Miguel Padilla
 Bryan giraldo



