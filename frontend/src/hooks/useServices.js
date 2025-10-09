import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export function useServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtener servicios ADMIN (incluye inactivos)
    const fetchServices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await api.get("/services/admin/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(res.data);
        } catch (err) {
            console.error("Error al cargar servicios:", err);
            Swal.fire("Error", "No se pudieron cargar los servicios", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Crear servicio con FormData (para archivos)
    const createService = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/services", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            Swal.fire("Éxito", "Servicio creado correctamente", "success");
            await fetchServices();
        } catch (err) {
            console.error("Error al crear servicio:", err);
            const errorMsg = err.response?.data?.message || "No se pudo crear el servicio";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    // Actualizar servicio con FormData
    const updateService = async (id, formData) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/services/${id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            Swal.fire("Actualizado", "Servicio actualizado correctamente", "success");
            await fetchServices();
        } catch (err) {
            console.error("Error al actualizar servicio:", err);
            const errorMsg = err.response?.data?.message || "No se pudo actualizar el servicio";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    // Desactivar servicio (soft delete)
    const deleteService = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Desactivar servicio?",
            text: "El servicio se ocultará del público pero no se eliminará",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
        });

        if (!confirm.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Desactivado", "Servicio desactivado correctamente", "success");
            await fetchServices();
        } catch (err) {
            console.error("Error al desactivar servicio:", err);
            Swal.fire("Error", "No se pudo desactivar el servicio", "error");
        }
    };

    // Reactivar servicio
    const reactivateService = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await api.patch(`/services/${id}/reactivate`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Reactivado", "Servicio reactivado correctamente", "success");
            await fetchServices();
        } catch (err) {
            console.error("Error al reactivar servicio:", err);
            Swal.fire("Error", "No se pudo reactivar el servicio", "error");
        }
    };

    // Eliminar permanentemente
    const permanentDeleteService = async (id) => {
        const confirm = await Swal.fire({
            title: "⚠️ ¡PELIGRO!",
            html: "Esto <strong>ELIMINARÁ PERMANENTEMENTE</strong> el servicio y todas sus imágenes.<br><br>Esta acción <strong>NO se puede deshacer</strong>.",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "SÍ, ELIMINAR PARA SIEMPRE",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            focusCancel: true,
        });

        if (!confirm.isConfirmed) return;

        // Segunda confirmación
        const finalConfirm = await Swal.fire({
            title: "¿Estás 100% seguro?",
            text: "Escribe 'ELIMINAR' para confirmar",
            input: 'text',
            inputPlaceholder: 'Escribe: ELIMINAR',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ELIMINAR DEFINITIVAMENTE",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
            preConfirm: (inputValue) => {
                if (inputValue !== 'ELIMINAR') {
                    Swal.showValidationMessage('Debes escribir exactamente: ELIMINAR');
                    return false;
                }
                return true;
            }
        });

        if (!finalConfirm.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/services/${id}/permanent`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Eliminado", "Servicio eliminado permanentemente", "success");
            await fetchServices();
        } catch (err) {
            console.error("Error al eliminar permanentemente:", err);
            Swal.fire("Error", "No se pudo eliminar el servicio", "error");
        }
    };

    return {
        services,
        loading,
        createService,
        updateService,
        deleteService,
        reactivateService,
        permanentDeleteService,
        fetchServices,
    };
}