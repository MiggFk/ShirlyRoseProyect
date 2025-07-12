import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-purple-700 text-white min-h-screen p-5 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Shirly Rose</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard" className="hover:bg-purple-800 p-2 rounded">Inicio</Link>
        <Link to="/dashboard/appointments" className="hover:bg-purple-800 p-2 rounded">Citas</Link>
        <Link to="/dashboard/products" className="hover:bg-purple-800 p-2 rounded">Productos</Link>
        <Link to="/dashboard/users" className="hover:bg-purple-800 p-2 rounded">Usuarios</Link>
      </nav>
    </div>
  );
}
