import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);

// Efecto para obtener el perfil del usuario al cargar el componente

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.profile);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

// Llama a la función para obtener el perfil del usuario

    fetchProfile();
  }, []);


// Si aún no se ha cargado el usuario, muestra un mensaje de carga
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

// Renderiza el perfil del usuario
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Perfil del Usuario</h2>
        <p><span className="font-semibold">Nombre:</span> {user.name}</p>
        <p><span className="font-semibold">Correo:</span> {user.email}</p>
        <p><span className="font-semibold">Rol:</span> {user.role}</p>

        <button
          onClick={() => {
            localStorage.clear();         // Borra token y datos
            window.location.href = "/";  // Redirige al login
          }}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
