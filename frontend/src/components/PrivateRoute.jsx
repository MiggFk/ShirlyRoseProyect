// components/PrivateRoute.jsx (CORREGIDO)
import { Navigate } from "react-router-dom";
// 💥 Importa el hook del Contexto
import { useAuth } from '../context/AuthContext'; 

export default function PrivateRoute({ children }) {
  // Obtiene el estado del contexto
  const { isAuthenticated, isLoading } = useAuth();

  // Muestra un indicador mientras se carga el estado de autenticación (ej. revisando localStorage)
  if (isLoading) {
    // Puedes reemplazar esto con un spinner o un componente de carga
    return <div className="p-10 text-center">Cargando sesión...</div>; 
  }

  // 💥 Redirección CORREGIDA: Si NO está autenticado, va al login.
  // La redirección a "/" no es la práctica común, es mejor ir al login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, permite el acceso
  return children;
}