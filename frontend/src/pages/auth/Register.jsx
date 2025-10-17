import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import { Eye, EyeOff, Check } from "lucide-react";
import { useState, useEffect } from "react";
import LogoShirly from "../../components/LogoShirly";
import { useRegister } from "../../hooks/useRegister";

export default function Register() {
  const { handleSubmit, isLoading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordValue, setPasswordValue] = useState(""); // Estado para la contraseña

  // Validación de fortaleza de contraseña
  const validatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(validatePasswordStrength(passwordValue));
  }, [passwordValue]);

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-orange-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-lime-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength) => {
    const texts = ["Muy débil", "Débil", "Regular", "Buena", "Excelente"];
    return texts[Math.min(strength, 4)];
  };

  // Validación Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .required("El nombre es obligatorio"),
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(8, "Mínimo 8 caracteres")
      .matches(/[A-Z]/, "Debe incluir mayúsculas")
      .matches(/[0-9]/, "Debe incluir números")
      .required("La contraseña es obligatoria"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("Confirma tu contraseña"),
    acceptedTerms: Yup.boolean()
      .oneOf([true], "Debes aceptar los términos y condiciones")
      .required("Debes aceptar los términos y condiciones"),
    acceptedPrivacy: Yup.boolean()
      .oneOf([true], "Debes aceptar la política de privacidad")
      .required("Debes aceptar la política de privacidad"),
  });

  // Animaciones
  const pageVariants = {
    initial: { x: "100%" },
    animate: { x: "0%", transition: { duration: 0.7, ease: "easeOut" } },
    exit: { x: "-100%", transition: { duration: 0.7, ease: "easeIn" } },
  };

  const triangleVariants = {
    hidden: { x: "-100%" },
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
    hidden: { opacity: 0, x: 50 },
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
        className="absolute left-0 top-0 bottom-0 w-2/3 bg-rose-200 z-0"
        style={{ clipPath: "polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)" }}
        variants={triangleVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Icono de Home */}
      <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="absolute right-8 top-8 text-rose-400 hover:text-rose-600 transition z-20"
      >
        <Link to="/" title="Volver al inicio">
          <FiHome size={32} />
        </Link>
      </motion.div>

      {/* Contenedor principal */}
      <div className="relative flex flex-col md:flex-row-reverse items-center justify-around w-full max-w-7xl mx-auto p-4 md:p-8 z-10">
        {/* Logo */}
        <motion.div
          className="flex justify-center items-center p-8 md:p-12 mb-8 md:mb-0"
          variants={logoContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <LogoShirly size="h-64 w-64 md:h-80 md:w-80" />
        </motion.div>

        {/* Formulario con Formik */}
        <motion.div
          className="w-full max-w-md p-6 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-4xl font-bold text-center mb-6 text-rose-600 drop-shadow-sm">
            Crear cuenta
          </h2>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              acceptedTerms: false,
              acceptedPrivacy: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Nombre */}
                <div>
                  <Field
                    name="name"
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      touched.name && errors.name
                        ? 'border-red-400 bg-red-50 focus:ring-red-300'
                        : 'border-rose-200 focus:ring-rose-300'
                    }`}
                    placeholder="Nombre completo"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="bg-red-100 text-red-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                {/* Email */}
                <div>
                  <Field
                    name="email"
                    type="email"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      touched.email && errors.email
                        ? 'border-red-400 bg-red-50 focus:ring-red-300'
                        : 'border-rose-200 focus:ring-rose-300'
                    }`}
                    placeholder="Correo electrónico"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="bg-red-100 text-red-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(e) => {
                        setFieldValue("password", e.target.value);
                        setPasswordValue(e.target.value);
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10 ${
                        touched.password && errors.password
                          ? 'border-red-400 bg-red-50 focus:ring-red-300'
                          : 'border-rose-200 focus:ring-rose-300'
                      }`}
                      placeholder="Contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-rose-400 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Indicador de fortaleza */}
                  {values.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition ${
                              i < passwordStrength ? getPasswordStrengthColor(passwordStrength) : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        Fortaleza: <span className="font-semibold">{getPasswordStrengthText(passwordStrength)}</span>
                      </p>
                    </div>
                  )}

                  {/* Requisitos de contraseña */}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className={`flex items-center gap-2 ${values.password.length >= 8 ? "text-green-600" : "text-gray-500"}`}>
                      <Check size={14} /> Mínimo 8 caracteres
                    </div>
                    <div className={`flex items-center gap-2 ${/[A-Z]/.test(values.password) ? "text-green-600" : "text-gray-500"}`}>
                      <Check size={14} /> Una letra mayúscula
                    </div>
                    <div className={`flex items-center gap-2 ${/[0-9]/.test(values.password) ? "text-green-600" : "text-gray-500"}`}>
                      <Check size={14} /> Un número
                    </div>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="bg-red-100 text-red-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <div className="relative">
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10 ${
                        touched.confirmPassword && errors.confirmPassword
                          ? 'border-red-400 bg-red-50 focus:ring-red-300'
                          : 'border-rose-200 focus:ring-rose-300'
                      }`}
                      placeholder="Confirmar contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-rose-400 transition"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="bg-red-100 text-red-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                {/* Términos y privacidad */}
                <div className="flex items-start space-x-2 mt-2">
                  <Field
                    type="checkbox"
                    name="acceptedTerms"
                    id="terms"
                    className="h-4 w-4 mt-1 text-rose-500 border-rose-300 rounded focus:ring-rose-400 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    Acepto los{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      términos y condiciones
                    </a>
                  </label>
                </div>
                <ErrorMessage
                  name="acceptedTerms"
                  component="div"
                  className="bg-red-100 text-red-700 p-2 rounded-lg text-sm font-medium"
                />

                <div className="flex items-start space-x-2 mt-2">
                  <Field
                    type="checkbox"
                    name="acceptedPrivacy"
                    id="privacy"
                    className="h-4 w-4 mt-1 text-rose-500 border-rose-300 rounded focus:ring-rose-400 cursor-pointer"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700">
                    He leído y acepto la{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      Política de privacidad
                    </a>
                  </label>
                </div>
                <ErrorMessage
                  name="acceptedPrivacy"
                  component="div"
                  className="bg-red-100 text-red-700 p-2 rounded-lg text-sm font-medium"
                />

                <button
                  type="submit"
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registrando...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center text-gray-700 mt-6 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-rose-400 hover:text-rose-600 transition">
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}