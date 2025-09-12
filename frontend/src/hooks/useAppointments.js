import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../api/axios";

export function useAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(response.data.data || response.data);
        } catch (error) {
            console.error("Error al cargar citas:", error);
            Swal.fire("Error", "No se pudieron cargar las citas.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/appointments/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Swal.fire("Actualizada", "El estado de la cita ha sido actualizado", "success");
            fetchAppointments();
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            const msg = error.response?.data?.message || "No se pudo actualizar la cita";
            Swal.fire("Error", msg, "error");
        }
    };

    const deleteAppointment = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/appointments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments((prev) => prev.filter((cita) => cita._id !== id));
            Swal.fire("Eliminada", "La cita ha sido eliminada", "success");
        } catch (error) {
            console.error("Error al eliminar cita:", error);
            Swal.fire("Error", "No se pudo eliminar la cita", "error");
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return {
        appointments,
        isLoading,
        updateStatus,
        deleteAppointment,
    };
}