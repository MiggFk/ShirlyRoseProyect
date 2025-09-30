// src/hooks/useLogin.js (Versión Final)
import Swal from "sweetalert2";
import { useAuth } from '../context/AuthContext'; 

/**
 * Custom hook para manejar la lógica de envío del formulario de inicio de sesión.
 */
export const useLogin = () => {
  const { login, isLoading } = useAuth(); 
  // Ya no necesitamos 'navigate' aquí porque el Contexto lo maneja
  // const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // LLAMADA AL LOGIN DEL CONTEXTO (Esta llamada ya actualiza el estado y redirige)
      await login(values.email, values.password); 
      // Nota: Ya no esperamos el 'user' retornado

      // Mostrar alerta de éxito ANTES de que el Contexto redirija
      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: 'Redirigiendo a tu panel...',
        showConfirmButton: false,
        timer: 1500,
      }); 
      
      
    } catch (err) {
      // Manejar errores de la API
      const message = err.message || "Ocurrió un error desconocido.";
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, isLoading };
};