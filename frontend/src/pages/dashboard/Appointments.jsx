import React, { useState, useMemo } from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { useFormOptions } from "../../hooks/useFormOptions";
import AppointmentsCalendar from "../../components/AppointmentsCalendar";

export default function Appointments() {
  const {
    appointments,
    isLoading,
    createAppointment,
    updateStatus,
    deleteAppointment,
  } = useAppointments();
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

  // 🔹 Filtrar solo clientes válidos (que tengan usuarioId)
  const validClients = useMemo(() => {
    return clients.filter(c => c.name !== "Cliente sin usuario");
  }, [clients]);

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
    const base = "px-3 py-1 rounded-full text-xs font-bold";
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
    setFormData({
      clientId: "",
      serviceId: "",
      employeeId: "",
      dateTime: "",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-4xl font-bold mb-8 text-pink-600 text-center">
        💅 Gestor de Citas
      </h2>

      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("table")}
          className={`px-6 py-3 rounded-xl shadow-md transition-all font-semibold ${
            activeTab === "table"
              ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white scale-105"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          📋 Tabla
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-6 py-3 rounded-xl shadow-md transition-all font-semibold ${
            activeTab === "calendar"
              ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white scale-105"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          📅 Calendario
        </button>
      </div>

      {/* Botón solo admin */}
      {user?.role === "admin" && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold flex items-center gap-2"
          >
            ✨ Nueva Cita
          </button>
        </div>
      )}

      {/* 🔹 MODAL MEJORADO */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-5 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">📅 Nueva Cita</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Cliente */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  👤 Cliente
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 px-4 py-3 rounded-xl transition outline-none"
                >
                  <option value="">Seleccione un cliente</option>
                  {validClients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {validClients.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    ⚠️ No hay clientes disponibles. Crea un cliente primero.
                  </p>
                )}
              </div>

              {/* Servicio */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  💼 Servicio
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 px-4 py-3 rounded-xl transition outline-none"
                >
                  <option value="">Seleccione un servicio</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} - ${s.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Empleado */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  👨‍💼 Empleado
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 px-4 py-3 rounded-xl transition outline-none"
                >
                  <option value="">Seleccione un empleado</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha y Hora */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🕐 Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 px-4 py-3 rounded-xl transition outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={validClients.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-pink-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-semibold">Cargando citas...</p>
        </div>
      ) : activeTab === "table" ? (
        <>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-md">
            <input
              type="text"
              placeholder="🔍 Buscar por cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-2 border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-4 py-2 rounded-lg w-full md:w-auto"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border-2 border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-4 py-2 rounded-lg"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-2 border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-4 py-2 rounded-lg"
            >
              <option value="">Todos los estados</option>
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
              className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 transition font-semibold"
            >
              🔄 Limpiar
            </button>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-pink-400 to-pink-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-bold">Cliente</th>
                  <th className="py-4 px-6 text-left font-bold">Servicio</th>
                  <th className="py-4 px-6 text-left font-bold">Empleado</th>
                  <th className="py-4 px-6 text-left font-bold">Fecha</th>
                  <th className="py-4 px-6 text-left font-bold">Estado</th>
                  <th className="py-4 px-6 text-left font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((cita, i) => (
                    <tr
                      key={cita._id}
                      className={`border-b hover:bg-pink-50 transition ${
                        i % 2 === 0 ? "bg-white" : "bg-pink-50/50"
                      }`}
                    >
                      <td className="py-3 px-6 font-medium">
                        {cita.clientId?.name || "Sin nombre"}
                      </td>
                      <td className="py-3 px-6">
                        {cita.serviceId?.name || "Sin servicio"}
                      </td>
                      <td className="py-3 px-6">
                        {cita.employeeId?.name || "Sin empleado"}
                      </td>
                      <td className="py-3 px-6">
                        {new Date(cita.dateTime).toLocaleString()}
                      </td>
                      <td className="py-3 px-6">
                        <span className={getStatusBadge(cita.status)}>
                          {cita.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 flex gap-2">
                        <select
                          value={cita.status}
                          onChange={(e) => updateStatus(cita._id, e.target.value)}
                          className="border-2 border-pink-300 bg-white px-3 py-1 rounded-lg focus:ring-2 focus:ring-pink-400 text-sm font-semibold"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                        <button
                          onClick={() => deleteAppointment(cita._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-lg shadow hover:bg-red-600 transition font-semibold text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-8 px-6 text-center text-gray-500 font-semibold"
                      colSpan={6}
                    >
                      😔 No hay citas que coincidan con los filtros
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