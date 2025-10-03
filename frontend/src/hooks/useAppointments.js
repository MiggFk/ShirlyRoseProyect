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
      
      // 🔍 DEBUG: Ver qué trae el GET
      console.log("Citas traídas del backend:", response.data.data);
      console.log("Primera cita:", response.data.data[0]);
      
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      Swal.fire("Error", "No se pudieron cargar las citas.", "error");
    } finally {
      setIsLoading(false);
    }
  };

    const createAppointment = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/appointments", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // 🔍 DEBUG: Ver qué devuelve el backend
      console.log("Respuesta del backend al crear:", res.data);
      console.log("Cita creada:", res.data.data);
      console.log("ClientId:", res.data.data?.clientId);
      
      await fetchAppointments();
      
      Swal.fire("Éxito", "La cita ha sido creada correctamente", "success");
    } catch (error) {
      console.error("Error al crear cita:", error);
      const msg = error.response?.data?.message || "No se pudo crear la cita";
      Swal.fire("Error", msg, "error");
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
    const result = await Swal.fire({
      title: "¿Eliminar cita?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) => prev.filter((cita) => cita._id !== id));
      Swal.fire("Eliminada", "La cita ha sido eliminada", "success");
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      const msg = error.response?.data?.message || "No se pudo eliminar la cita";
      Swal.fire("Error", msg, "error");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    isLoading,
    createAppointment,
    updateStatus,
    deleteAppointment,
    fetchAppointments,
  };
}