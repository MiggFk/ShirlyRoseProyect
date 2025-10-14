import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../api/axios";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // 🔹 AJUSTE: backend ahora devuelve { data: [...] }
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las citas",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    try {
      const token = localStorage.getItem("token");
      
      console.log("📤 Enviando datos:", appointmentData);
      
      const response = await api.post("/appointments", appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Respuesta del servidor:", response.data);

      Swal.fire({
        icon: "success",
        title: "¡Cita creada!",
        text: "La cita se ha creado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      await fetchAppointments();
      return true;
    } catch (error) {
      console.error("❌ Error al crear cita:", error);
      
      const errorMessage = error.response?.data?.message || "Error al crear la cita";
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
      return false;
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/appointments/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchAppointments();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar el estado",
      });
    }
  };

  const deleteAppointment = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: "success",
          title: "Eliminada",
          text: "La cita ha sido eliminada",
          timer: 1500,
          showConfirmButton: false,
        });

        await fetchAppointments();
      } catch (error) {
        console.error("Error al eliminar cita:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la cita",
        });
      }
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
    refreshAppointments: fetchAppointments,
  };
};