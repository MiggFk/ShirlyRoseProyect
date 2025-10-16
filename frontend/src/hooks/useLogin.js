// src/hooks/useLogin.js (Versión Final Corregida)
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from '../context/AuthContext';
import api from "../api/axios";

/**
 * Custom hook para manejar el login con verificación de email
 */
export const useLogin = () => {
  const { login, isLoading } = useAuth(); 
  const navigate = useNavigate();

  // 🔹 Función para reenviar email de verificación
  const resendVerificationEmail = async (email) => {
    try {
      await api.post("/auth/resend-verification", { email });
      
      Swal.fire({
        icon: "success",
        title: "Email reenviado",
        text: "Revisa tu bandeja de entrada",
        confirmButtonColor: "#ff6b9d",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al reenviar el email",
        confirmButtonColor: "#ff6b9d",
      });
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // console.log("🔵 Iniciando login...");
      
      // 1. Llamar al login
      const user = await login(values.email, values.password);
      
      // console.log("✅ Login exitoso, usuario:", user);

      // 2. Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${user.name}`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      // 3. Redirigir después del SweetAlert
      setTimeout(() => {
        // console.log("🔄 Redirigiendo...");
        if (user.role === "admin" || user.role === "empleado") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1600);
      
    } catch (err) {
      // console.error("❌ Error en login:", err);
      
      const errorData = err.response?.data;
      
      // 🔹 CASO 1: Email no verificado
      if (errorData?.needsVerification) {
        Swal.fire({
          icon: 'warning',
          title: 'Email no verificado',
          html: `
            <p>${errorData.message}</p>
            <p class="text-sm text-gray-600 mt-2">
              ¿No recibiste el email de verificación?
            </p>
          `,
          showCancelButton: true,
          confirmButtonText: '📧 Reenviar email',
          cancelButtonText: 'Cerrar',
          confirmButtonColor: '#ff6b9d',
          cancelButtonColor: '#6c757d',
        }).then((result) => {
          if (result.isConfirmed) {
            resendVerificationEmail(errorData.email);
          }
        });
      } 
      // 🔹 CASO 2: Otros errores (credenciales inválidas, etc)
      else {
        const message = errorData?.message || err.message || "Correo o contraseña incorrectos";
        
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: message,
          confirmButtonColor: '#f43f5e',
          confirmButtonText: 'Intentar de nuevo'
        });
      }

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