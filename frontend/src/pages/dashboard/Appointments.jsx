import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppointments } from "../../hooks/useAppointments";
import { useFormOptions } from "../../hooks/useFormOptions";
import { HiOutlineClipboardList, HiOutlineCalendar, HiPlus } from "react-icons/hi";
import { FaTrashAlt } from "react-icons/fa";
import AppointmentsCalendar from "../../components/AppointmentsCalendar";

export default function Appointments() {
  const {
    appointments,
    isLoading,
    updateStatus,
    deleteAppointment,
    createAppointment,
  } = useAppointments();

  const { clients, services, employees, loading: optionsLoading, hasClients } = useFormOptions();

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("table");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    serviceId: "",
    employeeId: "",
    date: "", // 🔹 Separar fecha
    time: "", // 🔹 y hora
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const validClients = clients.filter((client) => client && client._id && client.name);

  // 🔹 Generar horarios disponibles (9:00 AM - 6:00 PM)
  const availableTimes = useMemo(() => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 18 && minute === 30) break; // Terminar a las 6:00 PM
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        times.push({ value: timeString, label: displayTime });
      }
    }
    return times;
  }, []);

  // 🔹 Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // 🔹 Obtener fecha máxima (3 meses adelante)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Agregar esta función auxiliar al inicio del componente
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Modificar el useMemo del filteredAppointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((cita) => {
      const clientName = cita.clientId?.name || "";
      const normalizedClientName = normalizeText(clientName);
      const normalizedSearch = normalizeText(search);
      
      const searchMatch = normalizedClientName.includes(normalizedSearch);
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

  const openModal = () => {
    setFormData({
      clientId: "",
      serviceId: "",
      employeeId: "",
      date: "",
      time: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setFormData({
      clientId: "",
      serviceId: "",
      employeeId: "",
      date: "",
      time: "",
    });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔹 Combinar fecha y hora
    if (!formData.date || !formData.time) {
      alert("Por favor selecciona fecha y hora");
      return;
    }

    const dateTime = `${formData.date}T${formData.time}:00`;
    
    const appointmentData = {
      clientId: formData.clientId,
      serviceId: formData.serviceId,
      employeeId: formData.employeeId,
      dateTime: dateTime,
    };

    console.log("📋 Datos del formulario:", appointmentData);
    
    const success = await createAppointment(appointmentData);
    
    if (success) {
      closeModal();
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-5xl font-bold mb-8 text-white text-left">
        Gestor de Citas
      </h2>

      {/* Tabs con efecto glass */}
      <div className="flex gap-4 mb-6 justify-center">
        {[
          { key: "table", icon: HiOutlineClipboardList, label: "Tabla" },
          { key: "calendar", icon: HiOutlineCalendar, label: "Calendario" },
        ].map(({ key, icon: Icon, label }) => (
          <motion.button
            key={key}
            onClick={() => setActiveTab(key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-2xl backdrop-blur-xl bg-white/10 text-white border border-white/20 shadow-md transition-all font-semibold flex items-center gap-2 ${
              activeTab === key ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            <Icon className="text-xl" />
            {label}
          </motion.button>
        ))}
      </div>

      {/* Botón solo admin */}
      {user?.role === "admin" && (
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-white/20 transition-all font-semibold flex items-center gap-2"
            onClick={openModal}
          >
            <HiPlus className="text-xl" /> Nueva Cita
          </motion.button>
        </div>
      )}

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4 mb-8 p-4 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-lg"
      >
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-300 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/30 flex-1 min-w-[200px]"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            setSearch("");
            setDateFilter("");
            setStatusFilter("");
          }}
          className="px-6 py-3 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-xl shadow-md hover:bg-white/20 transition-all font-semibold"
        >
          Limpiar
        </motion.button>
      </motion.div>

      {/* Tabla */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-white/30 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-300 font-semibold">Cargando citas...</p>
        </div>
      ) : activeTab === "table" ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/20 shadow-lg"
        >
          <table className="min-w-full text-sm text-white rounded-3xl overflow-hidden">
            <thead className="bg-white/5 backdrop-blur-xl border-b border-white/10">
              <tr>
                <th className="py-4 px-6 text-left font-bold uppercase">Cliente</th>
                <th className="py-4 px-6 text-left font-bold uppercase">Servicio</th>
                <th className="py-4 px-6 text-left font-bold uppercase">Empleado</th>
                <th className="py-4 px-6 text-left font-bold uppercase">Fecha</th>
                <th className="py-4 px-6 text-left font-bold uppercase">Estado</th>
                <th className="py-4 px-6 text-left font-bold uppercase">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((cita, i) => (
                  <motion.tr
                    key={cita._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 bg-white/5 transition-all"
                  >
                    <td className="py-3 px-6 font-medium text-white">
                      {cita.clientId?.name || "Sin nombre"}
                    </td>
                    <td className="py-3 px-6 text-white">
                      {cita.serviceId?.name || "Sin servicio"}
                    </td>
                    <td className="py-3 px-6 text-white">
                      {cita.employeeId?.name || "Sin empleado"}
                    </td>
                    <td className="py-3 px-6 text-white">
                      {new Date(cita.dateTime).toLocaleString('es-ES', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="py-3 px-6">
                      <span className={getStatusBadge(cita.status)}>
                        {cita.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 flex gap-2 items-center">
                      <select
                        value={cita.status}
                        onChange={(e) => updateStatus(cita._id, e.target.value)}
                        className="border border-white/20 bg-white/5 text-white px-3 py-1 rounded-lg backdrop-blur-md focus:ring-2 focus:ring-white/20 text-sm font-semibold"
                      >
                        <option value="pendiente" className="text-black">
                          Pendiente
                        </option>
                        <option value="completada" className="text-black">
                          Completada
                        </option>
                        <option value="cancelada" className="text-black">
                          Cancelada
                        </option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteAppointment(cita._id)}
                        className="inline-flex items-center justify-center w-9 h-9 text-rose-400 hover:text-red-500 transition"
                      >
                        <FaTrashAlt />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-300">
                    No hay citas que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <AppointmentsCalendar appointments={appointments} />
      )}

      {/* Modal para nueva cita */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl text-white w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">
                Nueva Cita
              </h3>

              {optionsLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-white/70">Cargando opciones...</p>
                </div>
              ) : !hasClients ? (
                <div className="text-center py-8">
                  <p className="text-yellow-300 mb-4">⚠️ No hay clientes registrados</p>
                  <p className="text-white/70 text-sm">Registra usuarios con rol "cliente" primero</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={closeModal}
                    className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl font-semibold"
                  >
                    Cerrar
                  </motion.button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Cliente */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Cliente *</label>
                    <select
                      name="clientId"
                      required
                      value={formData.clientId}
                      onChange={(e) =>
                        setFormData({ ...formData, clientId: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/30"
                    >
                      <option value="" className="text-black">Seleccionar cliente</option>
                      {validClients.map((c) => (
                        <option key={c._id} value={c._id} className="text-black">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Servicio */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Servicio *</label>
                    <select
                      name="serviceId"
                      required
                      value={formData.serviceId}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceId: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/30"
                    >
                      <option value="" className="text-black">Seleccionar servicio</option>
                      {services.map((s) => (
                        <option key={s._id} value={s._id} className="text-black">
                          {s.name} - ${s.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Empleado */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Especialista *</label>
                    <select
                      name="employeeId"
                      required
                      value={formData.employeeId}
                      onChange={(e) =>
                        setFormData({ ...formData, employeeId: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/30"
                    >
                      <option value="" className="text-black">Seleccionar especialista</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id} className="text-black">
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Fecha *</label>
                    <input
                      type="date"
                      required
                      min={getMinDate()}
                      max={getMaxDate()}
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/30"
                    />
                  </div>

                  {/* Hora */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Hora *</label>
                    <select
                      required
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/30"
                    >
                      <option value="" className="text-black">Seleccionar hora</option>
                      {availableTimes.map((time) => (
                        <option key={time.value} value={time.value} className="text-black">
                          {time.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-white/60 mt-1">
                      Horario: 9:00 AM - 6:00 PM
                    </p>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-between gap-4 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      onClick={closeModal}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      type="submit"
                      className="flex-1 bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
                    >
                      Guardar
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
