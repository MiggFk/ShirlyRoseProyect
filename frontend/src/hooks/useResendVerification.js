import { useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

/**
 * Custom hook para reenviar email de verificación
 */
export const useResendVerification = () => {
  const [loading, setLoading] = useState(false);

  const resendVerification = async (email) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/resend-verification", { email });

      Swal.fire({
        icon: "success",
        title: "¡Email enviado!",
        text: response.data.message,
        confirmButtonColor: "#ec4899",
      });

      return { success: true };
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al enviar email",
        confirmButtonColor: "#ec4899",
      });

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { resendVerification, loading };
};