import { motion, AnimatePresence} from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaBars,
  FaSignOutAlt,
  FaUserCircle,
  FaInfoCircle,
  FaSpa,
  FaTimes,
} from "react-icons/fa";

import paloRosa from "../assets/images/paloRosa.png";


// Tarjeta de contenido reutilizable
const ContentCard = ({ title, children }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-rose-400/70"
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <h3 className="text-xl font-semibold text-rose-700 mb-4 border-b pb-2 border-rose-100">
      {title}
    </h3>
    {children}
  </motion.div>
);

// Sidebar
const Sidebar = ({ isOpen, onClose, onLogout, user, setActiveTab }) => {
  const sidebarVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 80, damping: 18 } },
    exit: { x: "100%", transition: { duration: 0.3 } },
  };

  const linkData = [
    { name: "Menú Principal", tab: "dashboard", Icon: FaHome },
    { name: "Mis Citas", tab: "appointments", Icon: FaCalendarAlt },
    { name: "Historial", tab: "history", Icon: FaClock },
    { name: "Servicios VIP", tab: "vip", Icon: FaSpa },
    { name: "Ayuda", tab: "help", Icon: FaInfoCircle },
  ];

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-rose-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-rose-700">
                <FaUserCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">
                    {user.name.split(" ")[0]}
                  </h3>
                  <p className="text-sm opacity-80 truncate">{user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white hover:opacity-80">
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {linkData.map((link) => (
                <motion.button
                  key={link.tab}
                  onClick={() => handleNavigation(link.tab)}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-700 hover:bg-rose-100 hover:text-rose-800 transition"
                  whileHover={{ x: -5 }}
                >
                  <link.Icon className="text-rose-600 w-5 h-5" />
                  {link.name}
                </motion.button>
              ))}
            </nav>

            <div className="p-6 border-t">
              <motion.button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-300 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaSignOutAlt />
                Cerrar Sesión
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// Vistas
const DashboardView = ({ user }) => (
  <motion.div
    className="grid md:grid-cols-2 gap-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ContentCard title="Información de Cuenta">
      <div className="space-y-2 text-gray-700">
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Correo:</strong> {user.email}</p>
        <p><strong>Teléfono:</strong> {user.phone}</p>
      </div>
    </ContentCard>

    <ContentCard title="Resumen de Actividad">
      <div className="space-y-2 text-gray-700">
        <p><strong>Próxima Cita:</strong> 10/10/2025</p>
        <p><strong>Servicio:</strong> Facial Lifting Premium</p>
        <p><strong>Última Visita:</strong> 15/09/2025</p>
        <button className="mt-2 text-sm text-rose-300 hover:underline">
          Ver detalles completos
        </button>
      </div>
    </ContentCard>
  </motion.div>
);

const AppointmentsView = () => (
  <ContentCard title="Mis Citas Pendientes">
    <p className="text-gray-500">Aquí verás tus citas confirmadas o pendientes.</p>
    <div className="h-40 flex items-center justify-center text-rose-300 border border-dashed border-rose-200 mt-4 rounded-lg">
      Lista de citas agendadas aquí.
    </div>
  </ContentCard>
);

const HistoryView = () => (
  <ContentCard title="Historial de Servicios">
    <p className="text-gray-500">Aquí se mostrará el historial completo de servicios.</p>
    <div className="h-40 flex items-center justify-center text-rose-300 border border-dashed border-rose-200 mt-4 rounded-lg">
      (Historial vacío)
    </div>
  </ContentCard>
);

// Principal
const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return <p className="text-center mt-20">No has iniciado sesión...</p>;

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
      >
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:`url(${paloRosa})`,
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        </div>

        <div className="relative max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 rounded-full bg-rose-300 flex items-center justify-center text-white font-bold text-3xl shadow-lg"
            >
              {userInitials}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-white drop-shadow">
                Hola, {user.name.split(" ")[0]}
              </h1>
              <p className="text-rose-200">Bienvenida a Shirly Rose</p>
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
          className="bg-white rounded-2xl shadow-lg flex justify-around p-3 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[
            { id: "dashboard", label: "Menú", Icon: FaHome },
            { id: "appointments", label: "Mis Citas", Icon: FaCalendarAlt },
            { id: "history", label: "Historial", Icon: FaClock },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
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
            {activeTab === "appointments" && <AppointmentsView />}
            {activeTab === "history" && <HistoryView />}
          </AnimatePresence>
        </div>

      </main>
      <motion.footer
        className="text-center py-6 bg-rose-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
      >
        <Footer />
      </motion.footer>
    </div>
  );
};

export default Profile;
