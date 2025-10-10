<<<<<<< HEAD
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "../../hooks/useServices";
import { 
  Edit, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  AlertTriangle,
  Clock,
  Scissors
} from "lucide-react";
=======
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "../../hooks/useServices";
import { Edit, Trash2, Plus } from "lucide-react";
>>>>>>> 44e6a0bf447bd891f4a6265faa60eb85339bc747

export default function Services() {
  const { 
    services, 
    loading, 
    createService, 
    updateService, 
    deleteService, 
    reactivateService, 
    permanentDeleteService 
  } = useServices();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

<<<<<<< HEAD
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
=======
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "",
    });

    // Crear servicio
    const handleCreate = () => {
        setEditMode(false);
        setFormData({
            name: "",
            description: "",
            price: "",
            duration: "",
            category: "",
        });
        setShowModal(true);
>>>>>>> 44e6a0bf447bd891f4a6265faa60eb85339bc747
    };
    return durationMap[duration] || duration;
  };

<<<<<<< HEAD
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
=======
    // Editar servicio
    const handleEdit = (service) => {
        setEditMode(true);
        setCurrentService(service);
        setFormData({
            name: service.name,
            description: service.description || "",
            price: service.price,
            duration: service.duration,
            category: service.category || "",
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const serviceData = {
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            duration: Number(formData.duration),
            category: formData.category,
        };

        if (editMode) {
            await updateService(currentService._id, serviceData);
        } else {
            await createService(serviceData);
        }
        
        setShowModal(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
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
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
                <motion.h2
                    className="text-4xl font-bold text-white drop-shadow-lg"
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
                    Agregar
                </motion.button>
            </div>

            {/* Tabla con efecto glass */}
            <motion.div
                className="rounded-3xl overflow-hidden
                           bg-white/10 backdrop-blur-2xl
                           border border-white/30 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <table className="min-w-full text-sm text-left text-white rounded-3xl overflow-hidden">
                    {/* Encabezado */}
                    <thead className="bg-white/5 backdrop-blur-xl border-b border-white/20 rounded-t-3xl">
                        <tr className="text-white">
                            <th className="py-3 px-4 font-semibold">NOMBRE</th>
                            <th className="py-3 px-4 hidden sm:table-cell font-semibold">DESCRIPCION</th>
                            <th className="py-3 px-4 font-semibold">PRECIO</th>
                            <th className="py-3 px-4 font-semibold">DURACION</th>
                            <th className="py-3 px-4 hidden md:table-cell font-semibold">CATEGORIA</th>
                            <th className="py-3 px-4 text-center font-semibold">ACCIONES</th>
                        </tr>
                    </thead>

                    {/* Cuerpo */}
                    <tbody className="rounded-b-3xl overflow-hidden">
                        <AnimatePresence>
                            {services.length > 0 ? (
                                services.map((s) => (
                                    <motion.tr
                                        key={s._id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-b border-white/5
                                                   bg-white/10 backdrop-blur-1xl
                                                   transition-all last:rounded-b-3xl"
                                    >
                                        <td className="py-3 px-4 font-medium text-gray-100">{s.name}</td>
                                        <td className="py-3 px-4 text-gray-200 hidden sm:table-cell">{s.description}</td>
                                        <td className="py-3 px-4 text-gray-100 font-semibold">${s.price}</td>
                                        <td className="py-3 px-4 text-gray-100">{s.duration} min</td>
                                        <td className="py-3 px-4 text-gray-100 hidden md:table-cell">{s.category || 'General'}</td>
                                        <td className="py-3 px-4 text-center space-x-2">
                                            <motion.button
                                                onClick={() => handleEdit(s)}
                                                whileHover={{ scale: 1.1 }}
                                                className="inline-flex items-center justify-center w-9 h-9 text-white transition"
                                                aria-label="Editar"
                                            >
                                                <Edit size={16} />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => deleteService(s._id)}
                                                whileHover={{ scale: 1.1 }}
                                                className="inline-flex items-center justify-center w-9 h-9 text-red-400 hover:text-red-500 transition"
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-300 text-lg">
                                        No hay servicios registrados
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>

            {/* Modal con diseño glass */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl text-white w-full max-w-md"
                        >
                            <h3 className="text-2xl font-bold mb-6 text-center">
                                {editMode ? "Editar Servicio" : "Agregar Servicio"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/30"
                                />

                                <textarea
                                    placeholder="Descripción"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/30 min-h-[100px]"
                                />

                                <input
                                    type="number"
                                    placeholder="Precio"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/30"
                                />

                                <input
                                    type="number"
                                    placeholder="Duración (minutos)"
                                    required
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/30"
                                />

                                <input
                                    type="text"
                                    placeholder="Categoría"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/30"
                                />

                                <div className="flex justify-between gap-4 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        type="submit"
                                        className="flex-1 bg-rose-400 hover:bg-rose-500 border border-white/20 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
                                    >
                                        Guardar
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
                                    >
                                        Cancelar
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
>>>>>>> 44e6a0bf447bd891f4a6265faa60eb85339bc747
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
          className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Scissors className="text-rose-300" size={32} />
          Gestión de Servicios
        </motion.h2>

        <motion.button
          onClick={handleCreate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-rose-300 text-rose-600 font-bold px-5 py-2 rounded-full shadow-md hover:bg-rose-500 hover:text-white transition"
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
              <p className="text-green-300 font-semibold">Servicios Activos</p>
              <p className="text-2xl font-bold text-white">
                {services.filter(s => s.isActive).length}
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
              <p className="text-red-300 font-semibold">Servicios Inactivos</p>
              <p className="text-2xl font-bold text-white">
                {services.filter(s => !s.isActive).length}
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
              <p className="text-blue-300 font-semibold">Total Servicios</p>
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
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-100">
            <thead className="bg-white/10 backdrop-blur-xl border-b border-white/10">
              <tr className="text-rose-300">
                <th className="py-3 px-4">Imagen</th>
                <th className="py-3 px-4">Servicio</th>
                <th className="py-3 px-4 hidden md:table-cell">Descripción</th>
                <th className="py-3 px-4">Precio</th>
                <th className="py-3 px-4 hidden lg:table-cell">Duración</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
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
                          ? 'bg-white/5 hover:bg-white/10' 
                          : 'bg-red-500/10 hover:bg-red-500/20'
                      }`}
                    >
                      <td className="py-3 px-4">
                        {service.images && service.images.length > 0 ? (
                          <div className="relative group">
                            <img
                              src={service.images[0].url}
                              alt={service.name}
                              className={`w-12 h-12 object-cover rounded-lg border border-white/20 ${
                                !service.isActive ? 'opacity-50 grayscale' : ''
                              }`}
                            />
                            {service.images.length > 1 && (
                              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                +{service.images.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center border border-white/20">
                            <Scissors size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-medium max-w-[150px] truncate ${
                          service.isActive ? 'text-gray-100' : 'text-gray-400'
                        }`}>
                          {service.name}
                        </div>
                        <div className="text-xs text-gray-300 capitalize">
                          {service.category?.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-200 hidden md:table-cell">
                        <div className="max-w-xs truncate">
                          {service.description || 'Sin descripción'}
                        </div>
                      </td>
                      <td className={`py-3 px-4 font-semibold ${
                        service.isActive ? 'text-gray-100' : 'text-gray-400'
                      }`}>
                        ${service.price?.toLocaleString() || '0'}
                      </td>
                      <td className={`py-3 px-4 hidden lg:table-cell ${
                        service.isActive ? 'text-gray-100' : 'text-gray-400'
                      }`}>
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-rose-300" />
                          <span className="text-xs">
                            {formatDuration(service.duration)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {service.isActive ? (
                            <>
                              <Eye size={14} className="text-green-400" />
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                Activo
                              </span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} className="text-red-400" />
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                                Inactivo
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Editar */}
                          <motion.button
                            onClick={() => handleEdit(service)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Editar servicio"
                          >
                            <Edit size={16} />
                          </motion.button>

                          {/* Activar/Desactivar */}
                          {service.isActive ? (
                            <motion.button
                              onClick={() => deleteService(service._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-all"
                              title="Desactivar servicio"
                            >
                              <EyeOff size={16} />
                            </motion.button>
                          ) : (
                            <motion.button
                              onClick={() => reactivateService(service._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all"
                              title="Reactivar servicio"
                            >
                              <RotateCcw size={16} />
                            </motion.button>
                          )}

                          {/* Eliminar permanentemente */}
                          <motion.button
                            onClick={() => permanentDeleteService(service._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            title="ELIMINAR PERMANENTEMENTE"
                          >
                            <AlertTriangle size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Scissors size={48} className="text-gray-500" />
                        <p className="text-gray-300 text-lg">No hay servicios registrados</p>
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

// Componente Modal del formulario
function ServiceModal({ service, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || '',
    duration: service?.duration || '1_hora',
    category: service?.category || 'manicure_pedicure'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'manicure_pedicure', label: 'Manicure y Pedicure' },
    { value: 'tratamientos_faciales', label: 'Tratamientos Faciales' },
    { value: 'depilacion', label: 'Depilación' },
    { value: 'masajes', label: 'Masajes y Relajación' },
    { value: 'maquillaje_eventos', label: 'Maquillaje para Eventos' },
    { value: 'tratamientos_cabello', label: 'Tratamientos Capilares' },
  ];

  const durations = [
    { value: '30_min', label: '30 minutos' },
    { value: '45_min', label: '45 minutos' },
    { value: '1_hora', label: '1 hora' },
    { value: '1_hora_30_min', label: '1 hora 30 minutos' },
    { value: '2_horas', label: '2 horas' },
    { value: '2_horas_30_min', label: '2 horas 30 minutos' },
    { value: '3_horas', label: '3 horas' },
    { value: '3_horas_30_min', label: '3 horas 30 minutos' },
    { value: '4_horas', label: '4 horas' },
    { value: 'mas_4_horas', label: 'Más de 4 horas' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('duration', formData.duration);
      data.append('category', formData.category);

      for (let i = 0; i < selectedFiles.length; i++) {
        data.append('images', selectedFiles[i]);
      }

      if (service) {
        await onSave(service._id, data);
      } else {
        await onSave(data);
      }

      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Máximo 5 imágenes permitidas');
      e.target.value = '';
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
        className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Scissors className="text-rose-500" size={24} />
            {service ? 'Editar Servicio' : 'Crear Servicio'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del servicio *
            </label>
            <input
              type="text"
              placeholder="Ej: Manicure Completa"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              placeholder="Describe el servicio en detalle..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl h-20 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
            />
          </div>

          {/* Precio y Duración */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                placeholder="50000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                required
                min="0"
                step="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración *
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                required
              >
                {durations.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes del servicio {!service && '(máximo 5)'}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {selectedFiles.length} archivo(s) seleccionado(s):
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {Array.from(selectedFiles).map((file, index) => (
                    <li key={index} className="truncate">
                      • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {service && service.images && service.images.length > 0 && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-2">
                  Imágenes actuales ({service.images.length}):
                </p>
                <div className="flex gap-2 flex-wrap">
                  {service.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Imagen ${index + 1}`}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ))}
                </div>
                <p className="text-xs text-blue-500 mt-2">
                  Las nuevas imágenes se agregarán a las existentes
                </p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {service ? 'Actualizando...' : 'Creando...'}
                </div>
              ) : (
                service ? 'Actualizar Servicio' : 'Crear Servicio'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}