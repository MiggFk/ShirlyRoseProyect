import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export function useServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtener servicios
    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await api.get("/services");
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

    // Crear servicio
    const createService = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/services", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Éxito", "Servicio creado correctamente", "success");
            await fetchServices();
        } catch (err) {
            console.error("Error al crear servicio:", err);
            Swal.fire("Error", "No se pudo crear el servicio", "error");
        }
    };

    // Actualizar servicio
    const updateService = async (id, data) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/services/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Actualizado", "Servicio actualizado correctamente", "success");
            await fetchServices();
        } catch (err) {
            console.error("Error al actualizar servicio:", err);
            Swal.fire("Error", "No se pudo actualizar el servicio", "error");
        }
    };

    // Eliminar servicio
    const deleteService = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (!confirm.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Eliminado", "Servicio eliminado correctamente", "success");
            await fetchServices();
        } catch (err) {
            console.error("Error al eliminar servicio:", err);
            Swal.fire("Error", "No se pudo eliminar el servicio", "error");
        }
    };

    return {
        services,
        loading,
        createService,
        updateService,
        deleteService,
        fetchServices,
    };
}