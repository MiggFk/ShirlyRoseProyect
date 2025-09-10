import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../api/axios"; // 👈 tu instancia de axios

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data.data || response.data);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      const msg =
        error.response?.data?.message || "No se pudo actualizar la cita";
      alert(msg);
    }
  };

  const deleteAppointment = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cita?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments((prev) => prev.filter((cita) => cita._id !== id));
        Swal.fire("Eliminada", "La cita ha sido eliminada", "success");
      } catch (error) {
        console.error("Error al eliminar cita:", error);
        Swal.fire("Error", "No se pudo eliminar la cita", "error");
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🔎 Filtros
  const filteredAppointments = appointments.filter((cita) => {
    const clientName = cita.clientId?.name?.toLowerCase() || "";
    const searchMatch = clientName.includes(search.toLowerCase());

    const citaDate = new Date(cita.dateTime).toISOString().split("T")[0];
    const dateMatch = dateFilter ? citaDate === dateFilter : true;

    const statusMatch = statusFilter
      ? cita.status === statusFilter
      : true;

    return searchMatch && dateMatch && statusMatch;
  });

  // 🎨 Badges para estado
  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "pendiente":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "completada":
        return `${base} bg-green-100 text-green-700`;
      case "cancelada":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-pink-600">
        Citas registradas
      </h2>

      {/* 🔎 Barra de filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-3 py-2 rounded-lg w-60"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-3 py-2 rounded-lg"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-3 py-2 rounded-lg"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <button
          onClick={() => {
            setSearch("");
            setDateFilter("");
            setStatusFilter("");
          }}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 transition"
        >
          Limpiar filtros
        </button>
      </div>

      {/* 📋 Tabla */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-pink-400 to-pink-600 text-white">
            <tr>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Servicio</th>
              <th className="py-3 px-4">Empleado</th>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((cita, i) => (
                <tr
                  key={cita._id}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-pink-50" : "bg-white"
                  }`}
                >
                  <td className="py-2 px-4">
                    {cita.clientId?.name || "Sin nombre"}
                  </td>
                  <td className="py-2 px-4">
                    {cita.serviceId?.name || "Sin servicio"}
                  </td>
                  <td className="py-2 px-4">
                    {cita.employeeId?.name || "Sin empleado"}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(cita.dateTime).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <span className={getStatusBadge(cita.status)}>
                      {cita.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <select
                      value={cita.status}
                      onChange={(e) =>
                        updateStatus(cita._id, e.target.value)
                      }
                      className="border border-pink-300 bg-white px-2 py-1 rounded-lg focus:ring-2 focus:ring-pink-400"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                    <button
                      onClick={() => deleteAppointment(cita._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="py-4 px-4 text-center text-gray-500"
                  colSpan={6}
                >
                  No hay citas que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
