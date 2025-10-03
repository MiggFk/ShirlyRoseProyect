import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

/**
 * Custom hook para gestionar el perfil del usuario.
 *
 * Se encarga de la lógica de obtener los datos del perfil desde la API
 * y de la función de cerrar sesión, manteniendo el componente de perfil limpio.
 *
 * @returns {object} Un objeto con el usuario, el estado de carga y la función de logout.
 */
export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró el token de autenticación.");
        }
        
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.profile);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No se pudo cargar el perfil. Intenta iniciar sesión nuevamente.',
        }).then(() => {
          navigate("/login");
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres cerrar tu sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  return { user, loading, handleLogout };
};
