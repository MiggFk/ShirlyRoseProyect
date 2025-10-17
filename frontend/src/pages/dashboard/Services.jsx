import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "../../hooks/useServices";
import {
  Edit,
  Plus,
  Eye,
  EyeOff,
  RotateCcw,
  AlertTriangle,
  Clock,
  Scissors,
} from "lucide-react";

export default function Services() {
  const {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    reactivateService,
    permanentDeleteService,
  } = useServices();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleCreate = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  // Función para formatear duración
  const formatDuration = (duration) => {
    const durationMap = {
      '30_min': '30 minutos',
      '45_min': '45 minutos', 
      '1_hora': '1 hora',
      '1_hora_30_min': '1h 30m',
      '2_horas': '2 horas',
      '2_horas_30_min': '2h 30m',
      '3_horas': '3 horas',
      '3_horas_30_min': '3h 30m',
      '4_horas': '4 horas',
      'mas_4_horas': '+4 horas'
    };
    return durationMap[duration] || duration;
  };

  // Función para formatear categoría
  const formatCategory = (category) => {
    const categoryMap = {
      manicure_pedicure: "Manicure y Pedicure",
      tratamientos_faciales: "Tratamientos Faciales",
      depilacion: "Depilación",
      masajes: "Masajes y Relajación",
      maquillaje_eventos: "Maquillaje para Eventos",
      tratamientos_cabello: "Tratamientos Capilares",
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Gestión de Servicios
        </motion.h2>

        <motion.button
          onClick={handleCreate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-white/20 transition-all font-semibold flex items-center gap-2"
        >
          <Plus size={18} />
          Agregar Servicio
        </motion.button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Eye className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Servicios Activos</p>
              <p className="text-2xl font-bold text-white">
                {services.filter((s) => s.isActive).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <EyeOff className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Servicios Inactivos</p>
              <p className="text-2xl font-bold text-white">
                {services.filter((s) => !s.isActive).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Scissors className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Total Servicios</p>
              <p className="text-2xl font-bold text-white">
                {services.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabla */}
      <motion.div
        className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/30 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* SIN overflow-x-auto para evitar scroll horizontal */}
        <div className="w-full">
          <table className="w-full text-sm text-left text-gray-100">
            <thead className="bg-gradient-to-r from-white-10 to-pink-500/20 backdrop-blur-xl border-b border-white/20">
              <tr className="text-white">
                <th className="py-4 px-2 sm:px-4 font-semibold">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline">IMAGEN</span>
                    <span className="sm:hidden">Img</span>
                  </div>
                </th>
                <th className="py-4 px-2 sm:px-4 font-semibold">SERVICIO</th>
                <th className="py-4 px-2 sm:px-4 hidden lg:table-cell font-semibold">
                  Descripción
                </th>
                <th className="py-4 px-2 sm:px-4 font-semibold">PRECIO</th>
                <th className="py-4 px-2 sm:px-4 hidden md:table-cell font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="hidden lg:inline">DURACION</span>
                  </div>
                </th>
                <th className="py-4 px-2 sm:px-4 hidden xl:table-cell font-semibold">
                  Categoría
                </th>
                <th className="py-4 px-2 sm:px-4 font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="hidden sm:inline">ESTADO</span>
                  </div>
                </th>
                <th className="py-4 px-2 sm:px-4 text-center font-semibold">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {services.length > 0 ? (
                  services.map((service) => (
                    <motion.tr
                      key={service._id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className={`border-b border-white/10 transition-all ${
                        service.isActive
                          ? "bg-white/5"
                          : "bg-red-500/10"
                      }`}
                    >
                      {/* Imagen - más compacta */}
                      <td className="py-2 px-2 sm:py-3 sm:px-4">
                        {service.images && service.images.length > 0 ? (
                          <div className="relative group">
                            <img
                              src={service.images[0].url}
                              alt={service.name}
                              className={`w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg border border-white/20 ${
                                !service.isActive ? "opacity-50 grayscale" : ""
                              }`}
                            />
                            {service.images.length > 1 && (
                              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                                +{service.images.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-600 rounded-lg flex items-center justify-center border border-white/20">
                            <Scissors size={16} className="text-gray-400 sm:hidden" />
                            <Scissors size={20} className="text-gray-400 hidden sm:block" />
                          </div>
                        )}
                      </td>

                      {/* Servicio - truncado */}
                      <td className="py-2 px-2 sm:py-3 sm:px-4">
                        <div
                          className={`font-medium text-xs sm:text-sm max-w-[80px] sm:max-w-[120px] truncate ${
                            service.isActive ? "text-gray-100" : "text-gray-400"
                          }`}
                          title={service.name}
                        >
                          {service.name}
                        </div>
                      </td>

                      {/* Descripción - solo en pantallas grandes */}
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-200 hidden lg:table-cell">
                        <div
                          className="max-w-[150px] truncate text-xs"
                          title={service.description}
                        >
                          {service.description || "Sin descripción"}
                        </div>
                      </td>

                      {/* Precio */}
                      <td
                        className={`py-2 px-2 sm:py-3 sm:px-4 font-semibold text-xs sm:text-sm ${
                          service.isActive ? "text-gray-100" : "text-gray-400"
                        }`}
                      >
                        <div className="truncate">
                          ${service.price?.toLocaleString() || "0"}
                        </div>
                      </td>

                      {/* Duración - solo en md+ */}
                      <td
                        className={`py-2 px-2 sm:py-3 sm:px-4 hidden md:table-cell ${
                          service.isActive ? "text-gray-100" : "text-gray-400"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-rose-300" />
                          <span className="text-xs truncate">
                            {formatDuration(service.duration)}
                          </span>
                        </div>
                      </td>

                      {/* Categoría - solo en xl+ */}
                      <td
                        className={`py-2 px-2 sm:py-3 sm:px-4 hidden xl:table-cell ${
                          service.isActive ? "text-gray-100" : "text-gray-400"
                        }`}
                      >
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30 truncate block max-w-[100px]">
                          {formatCategory(service.category)}
                        </span>
                      </td>

                      {/* Estado - compacto */}
                      <td className="py-2 px-2 sm:py-3 sm:px-4">
                        <div className="flex items-center gap-1">
                          {service.isActive ? (
                            <>
                              <Eye size={12} className="text-green-400" />
                              <span className="px-1 sm:px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 hidden sm:inline">
                                Activo
                              </span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} className="text-red-400" />
                              <span className="px-1 sm:px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 hidden sm:inline">
                                Inactivo
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Acciones - más compactas */}
                      <td className="py-2 px-2 sm:py-3 sm:px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Editar */}
                          <motion.button
                            onClick={() => handleEdit(service)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1 sm:p-2 text-white hover:text-rose-300 rounded-lg transition-all"
                            title="Editar servicio"
                          >
                            <Edit size={14} />
                          </motion.button>

                          {/* Activar/Desactivar */}
                          {service.isActive ? (
                            <motion.button
                              onClick={() => deleteService(service._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 sm:p-2 text-white hover:text-rose-300 rounded-lg transition-all"
                              title="Desactivar servicio"
                            >
                              <EyeOff size={14} />
                            </motion.button>
                          ) : (
                            <motion.button
                              onClick={() => reactivateService(service._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 sm:p-2 text-white hover:text-rose-300 rounded-lg transition-all"
                              title="Reactivar servicio"
                            >
                              <RotateCcw size={14} />
                            </motion.button>
                          )}

                          {/* Eliminar permanentemente */}
                          <motion.button
                            onClick={() => permanentDeleteService(service._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1 sm:p-2 text-red-400 hover:text-red-300 rounded-lg transition-all"
                            title="ELIMINAR PERMANENTEMENTE"
                          >
                            <AlertTriangle size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Scissors size={48} className="text-gray-500" />
                        <p className="text-gray-300 text-lg">
                          No hay servicios registrados
                        </p>
                        <button
                          onClick={handleCreate}
                          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                        >
                          Crear primer servicio
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de formulario */}
      {showModal && (
        <ServiceModal
          service={editingService}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={editingService ? updateService : createService}
        />
      )}
    </motion.div>
  );
}

// Componente Modal COMPLETO con imágenes
function ServiceModal({ service, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price || "",
    duration: service?.duration || "1_hora",
    category: service?.category || "manicure_pedicure",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "manicure_pedicure", label: "Manicure y Pedicure" },
    { value: "tratamientos_faciales", label: "Tratamientos Faciales" },
    { value: "depilacion", label: "Depilación" },
    { value: "masajes", label: "Masajes y Relajación" },
    { value: "maquillaje_eventos", label: "Maquillaje para Eventos" },
    { value: "tratamientos_cabello", label: "Tratamientos Capilares" },
  ];

  const durations = [
    { value: "30_min", label: "30 minutos" },
    { value: "45_min", label: "45 minutos" },
    { value: "1_hora", label: "1 hora" },
    { value: "1_hora_30_min", label: "1 hora 30 minutos" },
    { value: "2_horas", label: "2 horas" },
    { value: "2_horas_30_min", label: "2 horas 30 minutos" },
    { value: "3_horas", label: "3 horas" },
    { value: "3_horas_30_min", label: "3 horas 30 minutos" },
    { value: "4_horas", label: "4 horas" },
    { value: "mas_4_horas", label: "Más de 4 horas" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear FormData para enviar archivos
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("duration", formData.duration);
      data.append("category", formData.category);

      // Agregar archivos si los hay
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("images", selectedFiles[i]);
      }

      if (service) {
        await onSave(service._id, data);
      } else {
        await onSave(data);
      }

      onClose();
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Máximo 5 imágenes permitidas");
      e.target.value = "";
      return;
    }
    setSelectedFiles(files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg flex items-center gap-2">
            <Scissors className="text-rose-300" size={24} />
            {service ? "Editar Servicio" : "Crear Servicio"}
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Nombre del servicio *
              </label>
              <input
                type="text"
                placeholder="Ej: Manicure Completa"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Descripción
              </label>
              <textarea
                placeholder="Describe el servicio en detalle..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder-white/50 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
              />
            </div>

            {/* Precio y Duración */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                  required
                  min="0"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Duración *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                  required
                >
                  {durations.map((duration) => (
                    <option key={duration.value} value={duration.value} className="bg-gray-800 text-white">
                      {duration.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-white text-black">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Imágenes del servicio {!service && "(máximo 5)"}
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-500/20 file:text-white hover:file:bg-rose-500/30"
              />
              {selectedFiles.length > 0 && (
                <div className="mt-2 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg">
                  <p className="text-sm text-white/90 font-medium mb-2">
                    {selectedFiles.length} archivo(s) seleccionado(s):
                  </p>
                  <ul className="text-xs text-white/70 space-y-1">
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index} className="truncate">
                        • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {service && service.images && service.images.length > 0 && (
                <div className="mt-2 p-3 bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 rounded-lg">
                  <p className="text-sm text-blue-300 font-medium mb-2">
                    Imágenes actuales ({service.images.length}):
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {service.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Imagen ${index + 1}`}
                        className="w-12 h-12 object-cover rounded border border-white/20"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-blue-300/70 mt-2">
                    Las nuevas imágenes se agregarán a las existentes
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
          </form>
        </div>

        {/* Botones fijos abajo */}
        <div className="flex gap-3 pt-4 mt-4 border-t border-white/20 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-rose-500 backdrop-blur-xl text-white/90 rounded-xl hover:bg-rose-700 transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-rose-400 hover:from-rose-600 hover:bg-rose-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-lg"
            onClick={handleSubmit}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {service ? "Actualizando..." : "Creando..."}
              </div>
            ) : service ? (
              "Actualizar Servicio"
            ) : (
              "Crear Servicio"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
