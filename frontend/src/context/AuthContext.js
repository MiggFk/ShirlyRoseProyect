import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // ⬅️ Usamos tu instancia de Axios

const AuthContext = createContext();

// Hook para acceder al contexto desde cualquier componente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // --- Constantes de Storage ---
  const TOKEN_KEY = 'token'; 
  const USER_DATA_KEY = 'user'; 

  // 3. Función de LOGOUT (Ahora estabilizada con useCallback)
  // Esto resuelve el warning de ESLint y el potencial re-render innecesario.
  const logout = useCallback((shouldNavigate = true) => { 
    // 1. Limpiar localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);

    // 2. Limpiar el header global de Axios (CRÍTICO)
    delete api.defaults.headers.common['Authorization']; 

    // 3. Limpiar estado
    setUser(null);

    // 4. Redirigir
    if (shouldNavigate) {
      navigate('/login'); 
    }
  }, [navigate]); // Solo depende de 'navigate' (que es estable)


  // 1. Efecto para cargar la sesión desde localStorage al inicio
  // Ahora es estable porque 'logout' es una dependencia estable.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userDataString = localStorage.getItem(USER_DATA_KEY);

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
        // 💥 CRÍTICO: Configura el header de Axios al cargar la aplicación
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

      } catch (e) {
        console.error("Error al restaurar sesión:", e);
        // Si hay error, limpiamos por seguridad
        logout(false); 
      }
    }
    setIsLoading(false);
  }, [logout]); // ⬅️ Dependencia estable.


  // 2. Función de LOGIN
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password }); 

      // 1. Guardar en localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));

      // 2. Guardar en el estado de React y configurar Axios
      setUser(data.user);
      // 💥 CRÍTICO: Configura el header de Axios inmediatamente después del login
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; 

      // 💥 NUEVA LÓGICA: Redirigir DENTRO del Contexto después de ESTABLECER el estado
      if (data.user.role === "admin" || data.user.role === "empleado") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error en login:", err);
      // 💥 PROPAGAR ERROR: Lanza el error para que useLogin.js lo capture
      const message = err.response?.data?.message || "Correo o contraseña incorrectos";
      throw new Error(message);
    }
  };
  

  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};