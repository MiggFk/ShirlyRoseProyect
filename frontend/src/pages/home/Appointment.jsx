import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Scissors, User, Package, Home, DollarSign } from "lucide-react";
import fondo from "../../assets/images/arbolOscuro.png";

export default function Appointment() {
  const location = useLocation();
  const selectedService = location.state?.service;

  // Usa estos datos para prellenar el formulario
  const [formData, setFormData] = useState({
    service: selectedService?._id || "",
    serviceName: selectedService?.name || "",
    nombre: "",
    hora: "",
    fecha: "",
    producto: "",
  });

  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({
        ...prev,
        service: selectedService._id,
        serviceName: selectedService.name,
        price: selectedService.price,
        duration: selectedService.duration,
      }));
    }
  }, [selectedService]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cita agendada:", formData);
    // Aquí puedes agregar lógica para guardar la cita en backend
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Fondo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Botón volver */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-30 flex items-center justify-center w-12 h-12 hover:scale-110 hover:text-rose-400 transition-all duration-300 text-white"
        title="Volver al inicio"
      >
        <Home size={40} />
      </Link>

      {/* Formulario */}
      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-flex items-center justify-center mb-4"
            >
              <Calendar className="text-rose-500" size={40} />
            </motion.div>
            <h2 className="text-4xl font-bold bg-rose-400 bg-clip-text text-transparent mb-2">
              Agenda tu Cita
            </h2>
            <p className="text-gray-600">
              Reserva tu momento de belleza y bienestar
            </p>
          </div>

          {/* Si llega desde un servicio, mostrar resumen arriba */}
          {selectedService && (
            <motion.div
              className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-gray-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-rose-600">{selectedService.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedService.category && selectedService.category.charAt(0).toUpperCase() + selectedService.category.slice(1)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="flex items-center text-rose-500 font-medium">
                    <DollarSign size={16} className="mr-1" /> {selectedService.price?.toLocaleString()}
                  </span>
                  {selectedService.duration && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {selectedService.duration} min
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" size={20} />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-rose-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white/50"
                  required
                />
              </div>
            </motion.div>

            {/* Servicio */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicio
              </label>
              <div className="relative">
                <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" size={20} />
                <select
                  name="servicio"
                  value={formData.serviceName}
                  onChange={handleChange}
                  disabled={!!selectedService} // Si viene de "Reservar", bloquear edición
                  className="w-full pl-11 pr-4 py-3 border-2 border-rose-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white/50 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="spa">Spa</option>
                  <option value="peluqueria">Peluquería</option>
                  <option value="manicure">Manicure/Pedicure</option>
                  <option value="facial">Estética Facial</option>
                  <option value="depilacion">Depilación</option>
                </select>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {/* Fecha */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" size={20} />
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-rose-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white/50"
                    required
                  />
                </div>
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" size={20} />
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-rose-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white/50"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Producto opcional */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto adicional <span className="text-gray-400">(opcional)</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" size={20} />
                <input
                  type="text"
                  name="producto"
                  placeholder="Ej: Tratamiento capilar"
                  value={formData.producto}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-rose-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white/50"
                />
              </div>
            </motion.div>

            {/* Botón confirmar */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="w-full bg-rose-400 hover:bg-rose-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
            >
              Confirmar Cita
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Recibirás una confirmación por correo electrónico
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
