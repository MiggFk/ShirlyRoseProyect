import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "../../hooks/useServices";
import { Edit, Trash2, Plus } from "lucide-react";

export default function Services() {
    const { services, loading, createService, updateService, deleteService } = useServices();

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
    };

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
    );
}