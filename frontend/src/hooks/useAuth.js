// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

// 🚨 IMPORTANTE: Ajusta esta URL base si tu API no corre en el mismo dominio.
const API_BASE_URL = 'http://localhost:5000'; 

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para navegar después de login/logout

  // --- Constantes de Storage ---
  const TOKEN_KEY = 'auth_token';
  const USER_DATA_KEY = 'user_data';

  // 1. Efecto para inicializar el estado al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userDataString = localStorage.getItem(USER_DATA_KEY);

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      } catch (e) {
        console.error("Error al parsear datos de usuario de localStorage:", e);
        // Si hay error, limpiamos por seguridad
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Función de LOGIN
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Lanza un error si la respuesta HTTP no es 2xx
        throw new Error(data.message || 'Error al iniciar sesión. Credenciales inválidas.');
      }

      // Proceso Exitoso:
      const { token, user } = data; // Extrae token y user del cuerpo de la respuesta

      // 1. Guardar en localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

      // 2. Guardar en el estado de React
      setUser(user);

      // 3. Redirigir al dashboard
      navigate('/dashboard');

    } catch (err) {
      setError(err.message || 'Ocurrió un error de conexión.');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Función de LOGOUT
  const logout = () => {
    // 1. Limpiar localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);

    // 2. Limpiar estado
    setUser(null);
    setError(null);

    // 3. Redirigir al login o a la página principal
    navigate('/'); 
  };
  
  // El hook devuelve todo lo que el componente Sidebar necesita
  return {
    user,
    isLoading,
    isAuthenticated: !!user, // true si user no es null
    error,
    login,
    logout,
    // La función que obtiene el token (útil para otras peticiones)
    getToken: () => localStorage.getItem(TOKEN_KEY), 
  };
};