import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Cargar perfil (memoizado para evitar recreación)
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.profile);
      localStorage.setItem("user", JSON.stringify(response.data.profile));
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      
      // Solo mostrar alerta si no es un error de cancelación
      if (error.code !== "ECONNABORTED" && error.code !== "ERR_CANCELED") {
        Swal.fire({
          icon: "error",
          title: "Error de carga",
          text: "No se pudo cargar el perfil. Intenta iniciar sesión nuevamente.",
        }).then(() => {
          localStorage.clear();
          navigate("/login");
        });
      }
    }
  }, [navigate]);

  // 🔹 Cargar citas del usuario (memoizado)
  const fetchAppointments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/users/profile/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      // No mostrar alerta, solo log en consola
    }
  }, []);

  // 🔹 Actualizar perfil con FormData para enviar archivos
  const updateProfile = async (data, imageFile) => {
    try {
      const token = localStorage.getItem("token");
      
      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone || '');
      formData.append('birthDate', data.birthDate || '');
      formData.append('address', JSON.stringify(data.address));
      
      // Agregar imagen si existe
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const response = await api.put("/users/profile", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tus datos se han guardado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el perfil. Intenta nuevamente.",
      });
      return false;
    }
  };

  // 🔹 Eliminar imagen de perfil
  const deleteProfileImage = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await api.delete("/users/profile/image", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar usuario local
      const updatedUser = { ...user, profileImage: null };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      Swal.fire({
        icon: "success",
        title: "Imagen eliminada",
        text: "Tu foto de perfil ha sido eliminada.",
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la imagen. Intenta nuevamente.",
      });
      return false;
    }
  };

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar tu sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  // 🔹 useEffect con cleanup para evitar memory leaks
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        setLoading(true);
        await fetchProfile();
        await fetchAppointments();
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [fetchProfile, fetchAppointments]);

  return {
    user,
    appointments,
    loading,
    handleLogout,
    updateProfile,
    deleteProfileImage,
    refreshProfile: fetchProfile,
    refreshAppointments: fetchAppointments,
  };
};