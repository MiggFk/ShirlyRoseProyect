import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SidebarDashboard";
import fondo from "../../assets/images/fondoASS.png";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen relative">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${fondo})` }}
      ></div>

      {/* Sidebar con altura completa y z-index */}
      <div className="relative z-20 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 p-5 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}