import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

/**
 * Custom hook para manejar la lógica de inicio de sesión.
 *
 * Este hook encapsula la llamada a la API, el almacenamiento del token
 * y la redirección del usuario, manteniendo el componente de login limpio.
 *
 * @returns {object} Un objeto con la función handleSubmit para Formik.
 */
export const useLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data } = await api.post("/auth/login", values);

      // Guardar token y datos del usuario en el almacenamiento local
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Mostrar alerta de éxito y luego redirigir
      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: 'Redirigiendo a tu panel...',
        showConfirmButton: false,
        timer: 1500, // La alerta se cierra automáticamente después de 1.5 segundos
      }).then(() => {
        // Redirigir al usuario según su rol
        if (data.user.role === "admin" || data.user.role === "empleado") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      });
    } catch (err) {
      // Manejar errores de la API y mostrar un modal de error
      const message = err.response?.data?.message || "Correo o contraseña incorrectos";
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: message,
      });
    } finally {
      // Deshabilitar el estado de envío del formulario
      setSubmitting(false);
    }
  };

  return { handleSubmit };
};
