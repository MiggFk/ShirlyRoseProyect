import axios from "axios";

const api = axios.create({
  baseURL:  "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente devolverla
  (error) => {
    // 🔧 CRÍTICO: NO redirigir si el error viene del endpoint de LOGIN
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    const isRegisterRequest = error.config?.url?.includes("/auth/register");

    // Si es un error 401 pero NO es de login/register, entonces sí limpiar sesión
    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      !isRegisterRequest
    ) {
      console.warn("⚠️ Sesión expirada, redirigiendo al login...");

      // Limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirigir al login
      window.location.href = "/login";
    }

    // Si es error de login/register, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

export default api;