import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SidebarDashboard";
import Plasma from "../../components/Plasma";
import "../../components/Plasma.css";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen relative bg-gray-900"> {/* Añadido bg-gray-900 */}
      {/* Fondo con Plasma */}
      <div className="fixed inset-0 z-0">
        <Plasma 
          color="#f472b6" // Cambiado a rose-700 para un rosa más oscuro
          speed={0.4}
          direction="forward"
          scale={2}
          opacity={0.5} // Reducida la opacidad para mejor efecto
          mouseInteractive={true}
        />
      </div>

      {/* Sidebar desplegable */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="relative z-10 py-5 pr-5 pl-24 md:pl-28 min-h-screen backdrop-blur-sm">
        <Outlet />
      </main>
    </div>
  );
}