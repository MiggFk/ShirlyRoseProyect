import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "../../hooks/useServices";

export default function Services() {
    const { services, loading, createService, updateService, deleteService } = useServices();

    // Crear servicio
    const handleCreate = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Agregar servicio",
            html: `
                <input id="swal-input-name" class="swal2-input" placeholder="Nombre" />
                <textarea id="swal-input-description" class="swal2-textarea" placeholder="Descripción"></textarea>
                <input id="swal-input-price" type="number" class="swal2-input" placeholder="Precio" />
                <input id="swal-input-duration" type="number" class="swal2-input" placeholder="Duración (minutos)" />
                <input id="swal-input-category" class="swal2-input" placeholder="Categoría" />
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                return {
                    name: document.getElementById("swal-input-name").value,
                    description: document.getElementById("swal-input-description").value,
                    price: Number(document.getElementById("swal-input-price").value),
                    duration: Number(document.getElementById("swal-input-duration").value),
                    category: document.getElementById("swal-input-category").value,
                };
            },
        });

        if (formValues) await createService(formValues);
    };

    // Editar servicio
    const handleEdit = async (service) => {
        const { value: formValues } = await Swal.fire({
            title: "Editar servicio",
            html: `
                <input id="swal-input-name" class="swal2-input" placeholder="Nombre" value="${service.name}" />
                <textarea id="swal-input-description" class="swal2-textarea" placeholder="Descripción">${service.description || ''}</textarea>
                <input id="swal-input-price" type="number" class="swal2-input" placeholder="Precio" value="${service.price}" />
                <input id="swal-input-duration" type="number" class="swal2-input" placeholder="Duración (minutos)" value="${service.duration}" />
                <input id="swal-input-category" class="swal2-input" placeholder="Categoría" value="${service.category || ''}" />
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                return {
                    name: document.getElementById("swal-input-name").value,
                    description: document.getElementById("swal-input-description").value,
                    price: Number(document.getElementById("swal-input-price").value),
                    duration: Number(document.getElementById("swal-input-duration").value),
                    category: document.getElementById("swal-input-category").value,
                };
            },
        });

        if (formValues) await updateService(service._id, formValues);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-pink-600">Gestión de Servicios</h2>
                <button
                    onClick={handleCreate}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 transition"
                >
                    + Agregar servicio
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gradient-to-r from-pink-400 to-pink-600 text-white">
                        <tr>
                            <th className="py-3 px-4">Nombre</th>
                            <th className="py-3 px-4 hidden sm:table-cell">Descripción</th>
                            <th className="py-3 px-4">Precio</th>
                            <th className="py-3 px-4">Duración</th>
                            <th className="py-3 px-4 hidden md:table-cell">Categoría</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {services.length > 0 ? (
                                services.map((s, i) => (
                                    <motion.tr
                                        key={s._id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                        className={`border-b ${i % 2 === 0 ? "bg-pink-50" : "bg-white"}`}
                                    >
                                        <td className="py-2 px-4 font-medium">{s.name}</td>
                                        <td className="py-2 px-4 text-gray-600 hidden sm:table-cell">{s.description}</td>
                                        <td className="py-2 px-4 text-gray-800 font-semibold">${s.price}</td>
                                        <td className="py-2 px-4">{s.duration} min</td>
                                        <td className="py-2 px-4 hidden md:table-cell">{s.category || 'General'}</td>
                                        <td className="py-2 px-4 text-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(s)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-full shadow-sm hover:bg-yellow-600 transition"
                                                aria-label="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => deleteService(s._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-full shadow-sm hover:bg-red-600 transition"
                                                aria-label="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500 text-lg">
                                        No hay servicios registrados
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}