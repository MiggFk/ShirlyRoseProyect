// src/hooks/useRegister.js (Versión Limpia)

import Swal from "sweetalert2";
import { useAuth } from '../context/AuthContext'; 

/**
 * Custom hook para manejar la lógica de registro de usuarios.
 * * Ahora delega la lógica de API, estado y redirección al AuthContext.
 */
export const useRegister = () => {
  // ⬅️ Obtiene la función register y el estado isLoading del contexto
  const { register, isLoading } = useAuth(); 

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // 💥 LLAMADA AL CONTEXTO: register gestiona la API, estado, token y redirección.
      await register(values.name, values.email, values.password); 

      // Mostrar alerta de éxito (la redirección ocurre en el contexto)
      Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada. Redirigiendo...',
        showConfirmButton: false,
        timer: 1500, // Tiempo reducido, ya que la redirección es manejada internamente
      }); 

    } catch (err) {
      // Manejar errores propagados desde el Contexto
      const message = err.message || "Ocurrió un error desconocido."; 
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, isLoading }; 
};