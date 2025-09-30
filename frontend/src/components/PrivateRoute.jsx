import { Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // ⬅️ CRÍTICO: Usar el Contexto

export default function PrivateRoute({ children }) {
  // ✅ Obtiene el estado centralizado
  const { isAuthenticated, isLoading } = useAuth(); 

  // 1. CONDICIÓN CRÍTICA: Esperar a que el Contexto termine de cargar.
  // Esto evita que la Sidebar se monte sin un estado de usuario definido.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-700">
        Verificando sesión...
      </div>
    );
  }
  
  // 2. Si NO está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  // 3. Si está autenticado y cargado, mostrar los hijos (DashboardLayout)
  return children;
}