import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  const TOKEN_KEY = 'token'; 
  const USER_DATA_KEY = 'user'; 

  // --- LOGOUT (Estable con useCallback) ---
  const logout = useCallback((shouldNavigate = true) => { 
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    delete api.defaults.headers.common['Authorization']; 
    setUser(null);

    if (shouldNavigate) {
      navigate('/login'); 
    }
  }, [navigate]);


  // --- CARGA INICIAL (Estable con useEffect) ---
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userDataString = localStorage.getItem(USER_DATA_KEY);

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
        // CRÍTICO: Configura el header de Axios al cargar la aplicación
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
      } catch (e) {
        console.error("Error al restaurar sesión:", e);
        logout(false); 
      }
    }
    setIsLoading(false);
  }, [logout]);


  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password }); 
    
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
      setUser(data.user);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; 
    
      // ✅ RETORNAR el usuario
      return data.user;
    } catch (err) {
      console.error("Error en login:", err);
      const message = err.response?.data?.message || "Correo o contraseña incorrectos";
      throw new Error(message);
    }
  };


  // Función de REGISTRO (Misma lógica de éxito que login)
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password }); 

      // 1. Guardar en localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));

      // 2. Guardar en el estado de React y configurar Axios
      setUser(data.user);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; 

      // 3. Redirigir DENTRO del Contexto (asume que el registro es auto-login)
      if (data.user.role === "admin" || data.user.role === "empleado") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      
    } catch (err) {
      console.error("Error en registro:", err);
      const message = err.response?.data?.message || "Error al registrar usuario.";
      throw new Error(message);
    }
  };
  

  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register, 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};