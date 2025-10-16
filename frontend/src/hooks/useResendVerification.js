import { useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

/**
 * Custom hook para reenviar email de verificación
 */
export const useResendVerification = () => {
  const [isLoading, setIsLoading] = useState(false);

  const resendEmail = async (email) => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email no proporcionado",
        confirmButtonColor: "#ff6b9d",
      });
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/resend-verification", { email });
      
      Swal.fire({
        icon: "success",
        title: "Email reenviado",
        html: `
          <p>Hemos reenviado el email de verificación a:</p>
          <p class="font-bold text-pink-600">${email}</p>
          <p class="text-sm text-gray-600 mt-2">Por favor revisa tu bandeja de entrada</p>
        `,
        confirmButtonColor: "#ff6b9d",
      });

      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al reenviar el email",
        confirmButtonColor: "#ff6b9d",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { resendEmail, isLoading };
};