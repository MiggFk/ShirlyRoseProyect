import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { Mail } from "lucide-react";
import Swal from "sweetalert2";
import LogoShirly from "../../components/LogoShirly";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validationSchemaStep1 = Yup.object({
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
  });

  const validationSchemaStep2 = Yup.object({
    code: Yup.string()
      .length(6, "El código debe tener 6 dígitos")
      .matches(/^[0-9]+$/, "El código solo debe contener números")
      .required("El código es obligatorio"),
  });

  const validationSchemaStep3 = Yup.object({
    password: Yup.string()
      .min(8, "Mínimo 8 caracteres")
      .matches(/[A-Z]/, "Debe incluir mayúsculas")
      .matches(/[0-9]/, "Debe incluir números")
      .required("La contraseña es obligatoria"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("Confirma tu contraseña"),
  });

  // Step 1: Enviar email
  const handleSendEmail = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/forgot-password", {
        email: values.email,
      });

      if (response.status === 200) {
        setEmail(values.email);
        setStep(2);
        Swal.fire({
          icon: "success",
          title: "Código enviado",
          text: "Revisa tu correo para obtener el código de recuperación",
          confirmButtonColor: "#ec4899",
          timer: 3000,
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al enviar el correo";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#ec4899",
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Step 2: Verificar código
  const handleVerifyCode = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/verify-reset-code", {
        email,
        code: values.code,
      });

      if (response.status === 200) {
        setStep(3);
        Swal.fire({
          icon: "success",
          title: "Código válido",
          text: "Ahora crea tu nueva contraseña",
          confirmButtonColor: "#ec4899",
          timer: 2000,
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Código inválido";
      Swal.fire({
        icon: "error",
        title: "Código inválido",
        text: errorMsg,
        confirmButtonColor: "#ec4899",
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Step 3: Resetear contraseña
  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/reset-password", {
        email,
        password: values.password,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "¡Contraseña actualizada!",
          text: "Tu contraseña ha sido cambiada exitosamente",
          confirmButtonColor: "#ec4899",
          timer: 2000,
        }).then(() => {
          window.location.href = "/login";
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al resetear la contraseña";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#ec4899",
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Animaciones
  const pageVariants = {
    initial: { x: "-100%" },
    animate: { x: "0%", transition: { duration: 0.7, ease: "easeOut" } },
    exit: { x: "100%", transition: { duration: 0.7, ease: "easeIn" } },
  };

  const triangleVariants = {
    hidden: { x: "100%" },
    visible: {
      x: "0%",
      transition: { type: "spring", stiffness: 50, damping: 15, duration: 1.5, delay: 0.2 },
    },
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 1.2 } },
  };

  const logoContainerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.8 } },
  };

  return (
    <motion.div
      className="relative flex items-center justify-center min-h-screen bg-rose-100 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Triángulo de fondo animado */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-2/3 bg-rose-200 z-0"
        style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        variants={triangleVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Icono de Home */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="absolute top-8 left-8 text-rose-400 hover:text-rose-600 transition z-20"
      >
        <Link to="/" title="Volver al inicio">
          <FiHome size={32} />
        </Link>
      </motion.div>

      {/* Botón atrás */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="absolute top-8 left-20 text-rose-400 hover:text-rose-600 transition z-20 cursor-pointer"
        onClick={() => {
          if (step > 1) {
            setStep(step - 1);
          } else {
            window.history.back();
          }
        }}
      >
        <FiArrowLeft size={32} title="Volver" />
      </motion.div>

      {/* Contenedor principal */}
      <div className="relative flex flex-col md:flex-row items-center justify-around w-full max-w-7xl mx-auto p-4 md:p-8 z-10">
        {/* Logo */}
        <motion.div
          className="flex justify-center items-center p-8 md:p-12 mb-8 md:mb-0"
          variants={logoContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <LogoShirly size="h-64 w-64 md:h-80 md:w-80" />
        </motion.div>

        {/* Formulario */}
        <motion.div
          className="w-full max-w-md p-6 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* STEP 1: Email */}
          {step === 1 && (
            <>
              <h2 className="text-4xl font-bold text-center mb-2 text-rose-600 drop-shadow-sm">
                Recuperar Contraseña
              </h2>
              <p className="text-center text-gray-600 text-sm mb-6">
                Ingresa tu correo para recibir un código de recuperación
              </p>

              <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchemaStep1}
                onSubmit={handleSendEmail}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Field
                          type="email"
                          name="email"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 transition ${
                            touched.email && errors.email
                              ? "border-red-400 bg-red-50 focus:ring-red-300 focus:border-transparent"
                              : "border-gray-300 focus:ring-pink-500 focus:border-transparent"
                          }`}
                          placeholder="tu@email.com"
                        />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="bg-red-100 text-red-700 p-2 rounded-lg mt-2 text-sm font-medium"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6"
                    >
                      {isLoading || isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      ) : (
                        "Enviar Código"
                      )}
                    </motion.button>
                  </Form>
                )}
              </Formik>

              <p className="text-center text-gray-700 mt-6">
                ¿Recordaste tu contraseña?{" "}
                <Link to="/login" className="text-rose-400 hover:text-rose-600 transition">
                  Inicia sesión
                </Link>
              </p>
            </>
          )}

          {/* STEP 2: Código */}
          {step === 2 && (
            <>
              <h2 className="text-4xl font-bold text-center mb-2 text-rose-600 drop-shadow-sm">
                Ingresa el Código
              </h2>
              <p className="text-center text-gray-600 text-sm mb-6">
                Revisa tu correo y copia el código de 6 dígitos
              </p>

              <Formik
                initialValues={{ code: "" }}
                validationSchema={validationSchemaStep2}
                onSubmit={handleVerifyCode}
              >
                {({ isSubmitting, errors, touched, values }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código de Recuperación
                      </label>
                      <Field
                        type="text"
                        name="code"
                        maxLength="6"
                        className={`w-full px-4 py-3 border rounded-xl text-center text-2xl tracking-widest focus:ring-2 transition ${
                          touched.code && errors.code
                            ? "border-red-400 bg-red-50 focus:ring-red-300 focus:border-transparent"
                            : "border-gray-300 focus:ring-pink-500 focus:border-transparent"
                        }`}
                        placeholder="000000"
                        inputMode="numeric"
                      />
                      <ErrorMessage
                        name="code"
                        component="div"
                        className="bg-red-100 text-red-700 p-2 rounded-lg mt-2 text-sm font-medium"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || isLoading || values.code.length !== 6}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6"
                    >
                      {isLoading || isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          Verificando...
                        </>
                      ) : (
                        "Verificar Código"
                      )}
                    </motion.button>
                  </Form>
                )}
              </Formik>

              <p className="text-center text-gray-600 text-sm mt-4">
                ¿No recibiste el código?{" "}
                <button
                  onClick={() => setStep(1)}
                  className="text-rose-400 hover:text-rose-600 transition font-medium"
                >
                  Intentar con otro email
                </button>
              </p>
            </>
          )}

          {/* STEP 3: Nueva Contraseña */}
          {step === 3 && (
            <>
              <h2 className="text-4xl font-bold text-center mb-2 text-rose-600 drop-shadow-sm">
                Nueva Contraseña
              </h2>
              <p className="text-center text-gray-600 text-sm mb-6">
                Ingresa tu nueva contraseña
              </p>

              <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={validationSchemaStep3}
                onSubmit={handleResetPassword}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition ${
                          touched.password && errors.password
                            ? "border-red-400 bg-red-50 focus:ring-red-300 focus:border-transparent"
                            : "border-gray-300 focus:ring-pink-500 focus:border-transparent"
                        }`}
                        placeholder="••••••••"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="bg-red-100 text-red-700 p-2 rounded-lg mt-2 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Contraseña
                      </label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "border-red-400 bg-red-50 focus:ring-red-300 focus:border-transparent"
                            : "border-gray-300 focus:ring-pink-500 focus:border-transparent"
                        }`}
                        placeholder="••••••••"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="bg-red-100 text-red-700 p-2 rounded-lg mt-2 text-sm font-medium"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6"
                    >
                      {isLoading || isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          Actualizando...
                        </>
                      ) : (
                        "Actualizar Contraseña"
                      )}
                    </motion.button>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}