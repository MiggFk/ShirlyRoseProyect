import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SidebarDashboard";
import fondo from "../../assets/images/fondoASS.png"; // ✅ Importa correctamente la imagen

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${fondo})` }}
      ></div>

      {/* Capa translúcida solo detrás del contenido principal */}
      <div className="absolute inset-0"></div>

      {/* Sidebar con z-index alto */}
      <div className="relative z-10">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 p-6 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
