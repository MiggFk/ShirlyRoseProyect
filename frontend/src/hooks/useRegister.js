// src/hooks/useRegister.js (Versión Limpia)

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from '../context/AuthContext'; 

/**
 * Custom hook para manejar la lógica de registro de usuarios.
 * * Ahora delega la lógica de API, estado y redirección al AuthContext.
 */
export const useRegister = () => {
  // ⬅️ Obtiene la función register y el estado isLoading del contexto
  const { register, isLoading } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // 1. LLAMAR AL REGISTER
      const user = await register(values.name, values.email, values.password); 

      // 2. MOSTRAR ALERTA DE ÉXITO
      await Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada!',
        text: 'Registro exitoso',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      // 3. REDIRIGIR DESPUÉS DE LA ALERTA
      if (user.role === "admin" || user.role === "empleado") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      
    } catch (err) {
      const message = err.message || "Error al registrar usuario";
      
      await Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: message,
        confirmButtonColor: '#f43f5e',
        confirmButtonText: 'Intentar de nuevo'
      });

      resetForm();
      
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, isLoading }; 
};