// src/hooks/useLogin.js (Simplificado para usar el contexto)
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// ⬅️ Importa el nuevo hook del contexto
import { useAuth } from '../context/AuthContext'; 

/**
 * Custom hook para manejar la lógica de envío del formulario de inicio de sesión.
 */
export const useLogin = () => {
  // ⬅️ Obtiene la función login, isLoading, etc. del contexto
  const { login, isLoading } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // 💥 LLAMADA AL LOGIN DEL CONTEXTO (realiza la petición a la API)
      const user = await login(values.email, values.password); 

      // Mostrar alerta de éxito y luego redirigir
      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: 'Redirigiendo a tu panel...',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Redirigir al usuario según su rol (usando el objeto 'user' devuelto)
        if (user.role === "admin" || user.role === "empleado") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      });
    } catch (err) {
      // Manejar errores de la API
      const message = err.response?.data?.message || "Correo o contraseña incorrectos";
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, isLoading }; // Retorna isLoading del contexto
};