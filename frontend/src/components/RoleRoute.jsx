import { Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // ⬅️ Usamos el Contexto

export default function RoleRoute({ children, allowedRoles }) {
  // ✅ Obtiene el estado centralizado
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. Esperar la carga del contexto
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-700">Verificando permisos...</div>;
  }
  
  // 2. Verificar autenticación (Si no está logueado, PrivateRoute debió atraparlo, pero chequeamos)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  // 3. Verificar el rol
  const isAuthorized = user && allowedRoles.includes(user.role);

  if (isAuthorized) {
    return children;
  }

  // 4. Si no tiene el rol, redirigir al perfil o dashboard
  // Redirigir al perfil es más seguro para evitar loops o errores 403.
  return <Navigate to="/profile" replace />;
}