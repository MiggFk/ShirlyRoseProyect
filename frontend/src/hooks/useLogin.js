// src/hooks/useLogin.js (Versión Final Corregida)
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
    try {
      // console.log("🔵 Iniciando login...");
      
      // 1. Llamar al login (guarda datos pero NO redirige)
      const user = await login(values.email, values.password);
      
      // console.log("✅ Login exitoso, usuario:", user);

      // 2. Mostrar SweetAlert
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      // 3. Redirigir después de 1.5 segundos (cuando cierre el SweetAlert)
      setTimeout(() => {
        // console.log("🔄 Redirigiendo...");
        if (user.role === "admin" || user.role === "empleado") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1600); // Un poco más que el timer del SweetAlert
      
    } catch (err) {
      // console.error("❌ Error en login:", err);
      
      const message = err.message || "Correo o contraseña incorrectos";
      
      // Mostrar error SIN redirigir
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: message,
        confirmButtonColor: '#f43f5e',
        confirmButtonText: 'Intentar de nuevo'
      });

      // Limpiar solo la contraseña
      if (resetForm) {
        resetForm({
          values: {
            email: values.email,
            password: ''
          }
        });
      }
      
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, isLoading };
};