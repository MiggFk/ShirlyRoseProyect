// src/hooks/useUsers.js
import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios",
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo usuario
  const createUser = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/users", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchUsers(); // Recargar lista

      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "El usuario se ha creado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      return response.data;
    } catch (err) {
      console.error("Error al crear usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "No se pudo crear el usuario",
      });
      throw err;
    }
  };

  // Actualizar usuario - FIX: Corregir problema de fecha (offset de zona horaria)
  const updateUser = async (id, userData) => {
    try {
      const token = localStorage.getItem("token");

      // 🔧 FIX: No convertir la fecha, enviarla tal cual (YYYY-MM-DD)
      const dataToSend = { ...userData };
      if (!dataToSend.birthDate || dataToSend.birthDate.trim() === "") {
        dataToSend.birthDate = null;
      }
      // Si hay fecha, la enviamos en formato YYYY-MM-DD sin convertir

      const response = await api.put(`/users/${id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchUsers(); // Recargar lista

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "Los cambios se han guardado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      return response.data;
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "No se pudo actualizar el usuario",
      });
      throw err;
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await fetchUsers(); // Recargar lista

        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          text: "El usuario se ha eliminado correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "No se pudo eliminar el usuario",
        });
      }
    }
  };

  // Activar/Desactivar usuario
  const toggleUserStatus = async (id, currentStatus) => {
    const result = await Swal.fire({
      title: `¿${currentStatus ? "Desactivar" : "Activar"} usuario?`,
      text: currentStatus
        ? "El usuario no podrá iniciar sesión"
        : "El usuario podrá iniciar sesión",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: currentStatus ? "Desactivar" : "Activar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await api.patch(
          `/users/${id}/toggle-status`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await fetchUsers(); // Recargar lista

        Swal.fire({
          icon: "success",
          title: currentStatus ? "Usuario desactivado" : "Usuario activado",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error al cambiar estado:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cambiar el estado del usuario",
        });
      }
    }
  };

  // Agrupar usuarios por rol
  const getUsersByRole = () => {
    const grouped = {
      admin: users.filter((u) => u.role === "admin"),
      empleado: users.filter((u) => u.role === "empleado"),
      cliente: users.filter((u) => u.role === "cliente"),
    };
    return grouped;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersByRole,
    toggleUserStatus,
  };
}