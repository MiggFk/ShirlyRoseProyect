// src/hooks/useUsers.js
import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Crear usuario
  const createUser = async (newUser) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualiza el estado de los usuarios
      setUsers((prevUsers) => [...prevUsers, res.data.user]);
      Swal.fire("Creado", "Usuario creado correctamente", "success");
    } catch (err) {
      console.error("Error al crear usuario:", err);
      Swal.fire("Error", "No se pudo crear el usuario", "error");
    }
  };

  // Editar usuario
  const editUser = async (id, updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(`/users/${id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
      Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      Swal.fire("Error", "No se pudo eliminar el usuario", "error");
    }
  };

  return { users, loading, createUser, editUser, deleteUser };
}