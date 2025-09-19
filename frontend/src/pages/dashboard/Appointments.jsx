import React, { useState, useMemo } from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { useFormOptions } from "../../hooks/useFormOptions";
import AppointmentsCalendar from "../../components/AppointmentsCalendar";

export default function Appointments() {
  const { appointments, isLoading, createAppointment, updateStatus, deleteAppointment } = useAppointments();
  const { clients, services, employees } = useFormOptions();

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    clientId: "",
    serviceId: "",
    employeeId: "",
    dateTime: "",
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((cita) => {
      const clientName = cita.clientId?.name?.toLowerCase() || "";
      const searchMatch = clientName.includes(search.toLowerCase());
      const citaDate = new Date(cita.dateTime).toISOString().split("T")[0];
      const dateMatch = dateFilter ? citaDate === dateFilter : true;
      const statusMatch = statusFilter ? cita.status === statusFilter : true;
      return searchMatch && dateMatch && statusMatch;
    });
  }, [appointments, search, dateFilter, statusFilter]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAppointment(formData);
    setShowModal(false);
    setFormData({ clientId: "", serviceId: "", employeeId: "", dateTime: "" });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center">
        Gestor de Citas
      </h2>

      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("table")}
          className={`px-4 py-2 rounded-lg shadow transition ${
            activeTab === "table"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tabla
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-2 rounded-lg shadow transition ${
            activeTab === "calendar"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Calendario
        </button>
      </div>

      {/* Botón solo admin */}
      {user?.role === "admin" && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 transition"
          >
            + Nueva Cita
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Crear nueva cita</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                required
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Seleccione un cliente</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceId: e.target.value })
                }
                required
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Seleccione un servicio</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                required
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Seleccione un empleado</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) =>
                  setFormData({ ...formData, dateTime: e.target.value })
                }
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === "table" ? (
        <>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-3 py-2 rounded-lg w-full md:w-auto"
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

          {/* Tabla */}
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
        </>
      ) : (
        <AppointmentsCalendar appointments={appointments} />
      )}
    </div>
  );
}
