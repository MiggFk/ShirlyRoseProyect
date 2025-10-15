// src/hooks/useLogin.js (Versión Final)
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from '../context/AuthContext'; 

/**
 * Custom hook para manejar la lógica de envío del formulario de inicio de sesión.
 */
export const useLogin = () => {
  const { login, isLoading } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // 🔧 Variable para evitar redirecciones múltiples
    let loginSuccessful = false;

    try {
      // 1. LLAMAR AL LOGIN
      const user = await login(values.email, values.password); 
      loginSuccessful = true;

      // 2. MOSTRAR ALERTA DE ÉXITO
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false, // 🔧 Evitar que cierren el modal
        allowEscapeKey: false,
      });

      // 3. DESPUÉS DE LA ALERTA, REDIRIGIR
      if (user.role === "admin" || user.role === "empleado") {
        navigate("/", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      
    } catch (err) {
      // ✅ ERROR: Mostrar alerta SIN redirigir
      console.error("❌ Error en login:", err);
      
      const message = err.message || "Correo o contraseña incorrectos";
      
      await Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: message,
        confirmButtonColor: '#f43f5e',
        confirmButtonText: 'Intentar de nuevo',
        allowOutsideClick: true,
      });

      // ✅ Limpiar solo el campo de contraseña
      resetForm({
        values: {
          email: values.email,
          password: ''
        }
      });
      
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, isLoading };
};