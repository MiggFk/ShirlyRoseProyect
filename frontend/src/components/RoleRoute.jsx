// components/RoleRoute.jsx (CORREGIDO)
import { Navigate } from "react-router-dom";
// 💥 Importa el hook del Contexto
import { useAuth } from '../context/AuthContext'; 

export default function RoleRoute({ children, allowedRoles }) {
  // Obtiene el estado del contexto
  const { user, isLoading } = useAuth(); 

  // Muestra el indicador de carga
  if (isLoading) {
    return <div className="p-10 text-center">Verificando permisos...</div>;
  }

  // 1. Verificación básica (debería ser capturado por PrivateRoute, pero es buena práctica)
  if (!user) {
    return <Navigate to="/login" replace />; 
  }

  // 2. Verificación de Rol
  const userRole = user.role;
  
  if (allowedRoles.includes(userRole)) {
    return children; // Rol permitido
  }

  // 💥 Redirección por Acceso Denegado: 
  // Redirige al /profile si el usuario está logeado pero no tiene el rol necesario.
  // Esto resuelve el problema que tenías de que el 'empleado' era redirigido al /profile.
  return <Navigate to="/profile" replace />;
}