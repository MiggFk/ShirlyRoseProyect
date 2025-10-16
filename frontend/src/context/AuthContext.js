import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  const TOKEN_KEY = 'token'; 
  const USER_DATA_KEY = 'user'; 

  // --- LOGOUT ---
  const logout = useCallback((shouldNavigate = true) => { 
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    delete api.defaults.headers.common['Authorization']; 
    setUser(null);

    if (shouldNavigate) {
      navigate('/login'); 
    }
  }, [navigate]);


  // --- CARGA INICIAL ---
  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_DATA_KEY);

      if (token && storedUser && storedUser !== 'undefined') {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.log('⚠️ Token expirado');
          logout(false);
        } else {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('❌ Error al restaurar sesión:', error);
      logout(false);
    } finally {
      setIsLoading(false);
    }
  }, [logout]);


  // --- LOGIN (NO REDIRIGE AUTOMÁTICAMENTE) ---
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password }); 
    
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
    setUser(data.user);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; 

    return data.user; // El hook useLogin maneja la redirección
  };


  // --- REGISTER (NO REDIRIGE AUTOMÁTICAMENTE) ---
  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password }); 
    return data; // El hook useRegister maneja la lógica post-registro
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