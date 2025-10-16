// src/hooks/useRegister.js (Versión Limpia)

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import api from "../api/axios";

/**
 * Custom hook para manejar el registro con verificación de email
 */
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    
    try {
      // 1. REGISTRAR USUARIO
      const res = await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      console.log('✅ Registro exitoso:', res.data);

      // 2. MOSTRAR ALERTA CON MENSAJE DE VERIFICACIÓN
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        html: `
          <div class="text-center">
            <p class="mb-2">Te hemos enviado un email de verificación a:</p>
            <p class="font-bold text-pink-600 text-lg">${values.email}</p>
            <p class="text-sm text-gray-600 mt-3">
              📧 Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación.
            </p>
            <p class="text-xs text-gray-500 mt-2">
              ⚠️ No podrás iniciar sesión hasta verificar tu cuenta
            </p>
          </div>
        `,
        confirmButtonColor: '#ff6b9d',
        confirmButtonText: 'Ir al login',
        allowOutsideClick: false,
      });

      // 3. REDIRIGIR AL LOGIN
      navigate("/login");
      
    } catch (err) {
      console.error('❌ Error en registro:', err);
      
      const message = err.response?.data?.message || "Error al registrar usuario";
      
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
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};