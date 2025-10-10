import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SidebarDashboard";
import fondo from "../../assets/images/fondoASS.png";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen relative">
      {/* Fondo */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${fondo})` }}
      ></div>

      {/* Sidebar desplegable */}
      <Sidebar />

      {/* Contenido principal con espacio para el botón hamburguesa */}
      <main className="relative z-10 py-5 pr-5 pl-24 md:pl-28 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}