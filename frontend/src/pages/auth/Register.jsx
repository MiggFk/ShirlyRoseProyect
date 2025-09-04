import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoShirly from "../../components/LogoShirly";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-100">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-rose-600 mb-6 drop-shadow-sm">
          Crear cuenta
        </h2>
        <LogoShirly size="h-20 w-20" />

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(3, "Mínimo 3 caracteres")
              .required("El nombre es obligatorio"),
            email: Yup.string()
              .email("Correo inválido")
              .required("El correo es obligatorio"),
            password: Yup.string()
              .min(6, "Mínimo 6 caracteres")
              .required("La contraseña es obligatoria"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
              .required("Confirma tu contraseña"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              // 1. Petición al backend
              const { data } = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                  name: values.name,
                  email: values.email,
                  password: values.password,
                }
              );

              // 2. Guardar token y usuario en localStorage
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user));

              // 3. Redirigir después de registro
              navigate("/profile");
            } catch (err) {
              if (err.response?.status === 400) {
                setFieldError("email", "Este correo ya está registrado");
              } else {
                alert("Error en el servidor. Intenta más tarde.");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Nombre</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Tu nombre completo"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Correo</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="ejemplo@correo.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Contraseña</label>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">
                  Confirmar contraseña
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Registrarse
              </button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes cuenta?{" "}
                  <a
                    href="/login"
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Inicia sesión
                  </a>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
