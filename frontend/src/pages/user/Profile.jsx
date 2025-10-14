import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import paloRosa from "../../assets/images/paloRosa.png";
import Swal from 'sweetalert2';
import {
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaBars,
  FaSignOutAlt,
  FaUserCircle,
  FaEdit,
  FaCamera,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";

// 🔹 COMPONENTE: Tarjeta de contenido
const ContentCard = ({ title, children }) => (
  <motion.div
    className="bg-white rounded-xl shadow-md p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold text-rose-500 mb-4">{title}</h2>
    {children}
  </motion.div>
);

// 🔹 COMPONENTE: Sidebar
const Sidebar = ({ isOpen, onClose, onLogout, user, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="relative w-64 bg-white h-full shadow-xl"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-rose-100 rounded-full transition"
            >
              <FaTimes className="w-6 h-6 text-rose-500" />
            </button>

            <div className="p-6 border-b border-rose-200">
              <div className="flex items-center gap-3">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Perfil"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 text-rose-400" />
                )}
                <div>
                  <p className="font-bold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  navigate("/");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaArrowLeft /> Volver al Inicio
              </button>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaHome /> Home
              </button>
              <button
                onClick={() => {
                  setActiveTab("edit");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaEdit /> Editar Perfil
              </button>
              <button
                onClick={() => {
                  setActiveTab("appointments");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaCalendarAlt /> Mis Citas
              </button>
              <button
                onClick={() => {
                  setActiveTab("history");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaClock /> Historial
              </button>
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition font-semibold"
              >
                <FaSignOutAlt /> Cerrar Sesión
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 🔹 VISTA: Editar Perfil
const EditProfileView = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.postalCode || "",
    birthDate: user?.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : "",
  });

  const [imageFile, setImageFile] = useState(null); // ← CAMBIO: guardar archivo
  const [imagePreview, setImagePreview] = useState(
    user?.profileImage?.url || user?.profileImage || null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'La imagen no debe superar los 5MB', 'error');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Solo se permiten archivos de imagen', 'error');
        return;
      }

      setImageFile(file); // ← CAMBIO: guardar archivo
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      birthDate: formData.birthDate,
    };

    const success = await onUpdate(profileData, imageFile); // ← CAMBIO: pasar archivo

    if (success) {
      setImageFile(null); // Limpiar archivo después de guardar
    }

    setLoading(false);
  };

  return (
    <ContentCard title="Editar Información Personal">
      <div className="space-y-4">
        {/* Foto de perfil */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-rose-200 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-20 h-20 text-rose-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-rose-500 text-white p-2 rounded-full cursor-pointer hover:bg-rose-600 transition">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Haz clic en el ícono para cambiar tu foto (máx. 5MB)
          </p>
          {imageFile && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Nueva imagen seleccionada: {imageFile.name}
            </p>
          )}
        </div>

        {/* Campos del formulario */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Código Postal
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition font-semibold disabled:bg-rose-300"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </ContentCard>
  );
};

// 🔹 VISTA: Dashboard
const DashboardView = ({ user }) => (
  <motion.div
    className="grid md:grid-cols-2 gap-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ContentCard title="Información de Cuenta">
      <div className="space-y-2 text-gray-700">
        {/* Imagen de perfil */}
        {user?.profileImage && (
          <div className="flex justify-center mb-4">
            <img
              src={user.profileImage.url || user.profileImage}
              alt="Perfil"
              className="w-24 h-24 rounded-full object-cover border-4 border-rose-300"
            />
          </div>
        )}
        <p>
          <strong>Nombre:</strong> {user?.name}
        </p>
        <p>
          <strong>Correo:</strong> {user?.email}
        </p>
        <p>
          <strong>Teléfono:</strong> {user?.phone || "No registrado"}
        </p>
        <p>
          <strong>Dirección:</strong>{" "}
          {user?.address?.street
            ? `${user.address.street}, ${user.address.city}`
            : "No registrada"}
        </p>
      </div>
    </ContentCard>

    <ContentCard title="Resumen de Actividad">
      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Rol:</strong> {user?.role === "cliente" ? "Cliente" : user?.role}
        </p>
        <p>
          <strong>Miembro desde:</strong>{" "}
          {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
        </p>
      </div>
    </ContentCard>
  </motion.div>
);

// 🔹 VISTA: Citas Pendientes
const AppointmentsView = ({ appointments }) => (
  <ContentCard title="Mis Citas Pendientes">
    {appointments.length === 0 ? (
      <p className="text-gray-500">No tienes citas agendadas.</p>
    ) : (
      <div className="space-y-4">
        {appointments
          .filter((apt) => apt.status === "pendiente")
          .map((apt) => (
            <div
              key={apt._id}
              className="border border-rose-200 p-4 rounded-lg bg-rose-50"
            >
              <p>
                <strong>Servicio:</strong> {apt.serviceId?.name}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(apt.dateTime).toLocaleString()}
              </p>
              <p>
                <strong>Empleado:</strong> {apt.employeeId?.name}
              </p>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full mt-2 inline-block">
                {apt.status}
              </span>
            </div>
          ))}
      </div>
    )}
  </ContentCard>
);

// 🔹 VISTA: Historial de Servicios
const HistoryView = ({ appointments }) => (
  <ContentCard title="Historial de Servicios">
    {appointments.length === 0 ? (
      <p className="text-gray-500">No hay historial disponible.</p>
    ) : (
      <div className="space-y-4">
        {appointments
          .filter((apt) => apt.status === "completada")
          .map((apt) => (
            <div
              key={apt._id}
              className="border border-gray-200 p-4 rounded-lg"
            >
              <p>
                <strong>Servicio:</strong> {apt.serviceId?.name}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(apt.dateTime).toLocaleDateString()}
              </p>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full mt-2 inline-block">
                Completada
              </span>
            </div>
          ))}
      </div>
    )}
  </ContentCard>
);

// 🔹 COMPONENTE PRINCIPAL
const Profile = () => {
  const { user, appointments, loading, handleLogout, updateProfile } =
    useProfile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-gray-600 text-lg">
          No has iniciado sesión...
        </p>
      </div>
    );
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
        setActiveTab={setActiveTab}
      />

      {/* Header */}
      <motion.header
        className="relative h-56 w-full shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage: `url(${paloRosa})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {user.profileImage ? (
              <motion.img
                src={user.profileImage}
                alt="Perfil"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 rounded-full bg-rose-300 flex items-center justify-center text-white font-bold text-3xl shadow-lg"
              >
                {userInitials}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-white drop-shadow">
                Hola, {user.name.split(" ")[0]}
              </h1>
              <p className="text-rose-100">Bienvenida a Shirly Rose</p>
            </motion.div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-4 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition text-white shadow-md"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-4 mt-[-3rem] pb-12">
        <motion.div
          className="bg-white rounded-2xl shadow-lg flex justify-around p-3 mt-16 overflow-x-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[
            { id: "dashboard", label: "Menú", Icon: FaHome },
            { id: "edit", label: "Editar Perfil", Icon: FaEdit },
            { id: "appointments", label: "Mis Citas", Icon: FaCalendarAlt },
            { id: "history", label: "Historial", Icon: FaClock },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-rose-400 text-white shadow-md"
                  : "bg-white text-rose-400 hover:bg-rose-50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <tab.Icon />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && <DashboardView user={user} />}
            {activeTab === "edit" && (
              <EditProfileView user={user} onUpdate={updateProfile} />
            )}
            {activeTab === "appointments" && (
              <AppointmentsView appointments={appointments} />
            )}
            {activeTab === "history" && (
              <HistoryView appointments={appointments} />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;