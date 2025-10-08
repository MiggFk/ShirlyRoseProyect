import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppointments } from "../../hooks/useAppointments";
import { useFormOptions } from "../../hooks/useFormOptions";
import AppointmentsCalendar from "../../components/AppointmentsCalendar";

// Íconos minimalistas
import { HiOutlineClipboardList, HiOutlineCalendar, HiPlus } from "react-icons/hi";
import { FaTrashAlt } from "react-icons/fa";

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

  const validClients = useMemo(() => {
    return clients.filter((c) => c.name !== "Cliente sin usuario");
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
      <h2 className="text-5xl font-bold mb-8 text-rose-600 text-center">
        💅 Gestor de Citas
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("table")}
          className={`px-6 py-3 rounded-xl shadow-md transition-all font-semibold flex items-center gap-2 ${
            activeTab === "table"
              ? "bg-rose-400 text-white scale-105"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <HiOutlineClipboardList className="text-xl" />
          Tabla
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-6 py-3 rounded-xl shadow-md transition-all font-semibold flex items-center gap-2 ${
            activeTab === "calendar"
              ? "bg-rose-400 text-white scale-105"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <HiOutlineCalendar className="text-xl" />
          Calendario
        </button>
      </div>

      {/* Botón solo admin */}
      {user?.role === "admin" && (
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            className="bg-rose-300 text-rose-700 px-6 py-3 rounded-xl shadow-lg hover:bg-rose-500 hover:text-white transition-all font-semibold flex items-center gap-2"
          >
            <HiPlus className="text-xl" /> Nueva Cita
          </motion.button>
        </div>
      )}

      {/* 🔹 Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
          >
            {/* Header */}
            <div className="bg-rose-400 px-6 py-5 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <HiOutlineCalendar /> Nueva Cita
              </h3>
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
                  Cliente
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 focus:border-rose-500 px-4 py-3 rounded-xl transition outline-none"
                >
                  <option value="">Seleccione un cliente</option>
                  {validClients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Servicio */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Servicio
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 focus:border-rose-500 px-4 py-3 rounded-xl transition outline-none"
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
                  Empleado
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 focus:border-rose-500 px-4 py-3 rounded-xl transition outline-none"
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
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border-2 border-gray-200 focus:border-rose-500 px-4 py-3 rounded-xl transition outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={validClients.length === 0}
                  className="flex-1 px-6 py-3 bg-rose-400 text-white rounded-xl font-bold hover:bg-rose-600 transition shadow-lg disabled:opacity-50"
                >
                  Crear Cita
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-semibold">Cargando citas...</p>
        </div>
      ) : activeTab === "table" ? (
        <>
          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-md"
          >
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-2 border-rose-300 px-4 py-2 rounded-lg w-full md:w-auto focus:ring-2 focus:ring-rose-400"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border-2 border-rose-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-rose-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-2 border-rose-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-rose-400"
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
              className="bg-rose-400 text-white px-6 py-2 rounded-lg shadow hover:bg-rose-700 transition font-semibold"
            >
              Limpiar
            </button>
          </motion.div>

          {/* Tabla */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto bg-white rounded-2xl shadow-xl"
          >
            <table className="min-w-full text-sm">
              <thead className="bg-rose-400 text-white">
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
                      className={`border-b hover:bg-rose-50 transition ${
                        i % 2 === 0 ? "bg-white" : "bg-rose-50/50"
                      }`}
                    >
                      <td className="py-3 px-6 font-medium">{cita.clientId?.name || "Sin nombre"}</td>
                      <td className="py-3 px-6">{cita.serviceId?.name || "Sin servicio"}</td>
                      <td className="py-3 px-6">{cita.employeeId?.name || "Sin empleado"}</td>
                      <td className="py-3 px-6">{new Date(cita.dateTime).toLocaleString()}</td>
                      <td className="py-3 px-6">
                        <span className={getStatusBadge(cita.status)}>{cita.status}</span>
                      </td>
                      <td className="py-3 px-6 flex gap-2">
                        <select
                          value={cita.status}
                          onChange={(e) => updateStatus(cita._id, e.target.value)}
                          className="border-2 border-rose-200 bg-white px-3 py-1 rounded-lg focus:ring-2 focus:ring-rose-400 text-sm font-semibold"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                        <button
                          onClick={() => deleteAppointment(cita._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-lg shadow hover:bg-red-600 transition font-semibold text-sm flex items-center gap-1"
                        >
                          <FaTrashAlt />
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
                      No hay citas que coincidan con los filtros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </>
      ) : (
        <AppointmentsCalendar appointments={appointments} />
      )}
    </div>
  );
}
