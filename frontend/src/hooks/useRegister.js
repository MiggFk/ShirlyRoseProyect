import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

/**
 * Custom hook para manejar la lógica de registro de usuarios.
 *
 * Este hook encapsula la llamada a la API para registrar un nuevo usuario,
 * el almacenamiento del token y la redirección, manteniendo el componente
 * de registro limpio y centrado en la presentación.
 *
 * @returns {object} Un objeto con la función handleSubmit para Formik.
 */
export const useRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data } = await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Guardar token y datos del usuario en el almacenamiento local
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Mostrar alerta de éxito antes de redirigir
      Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        showConfirmButton: false,
        timer: 3000 // La alerta se cierra automáticamente después de 3 segundos
      }).then(() => {
        navigate("/login");
      });

    } catch (err) {
      // Manejar errores de la API
      let message = "Error en el servidor. Intenta más tarde.";
      if (err.response?.status === 400) {
        message = "Este correo ya está registrado";
      }
      console.error("Error en el registro:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    } finally {
      // Deshabilitar el estado de envío del formulario
      setSubmitting(false);
    }
  };

  return { handleSubmit };
};
