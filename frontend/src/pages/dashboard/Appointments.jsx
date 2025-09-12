import React, { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import api from "./../../api/axios";

// --- Custom Hook para la lógica de datos
const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(response.data.data || response.data);
        } catch (error) {
            console.error("Error al cargar citas:", error);
            Swal.fire("Error", "No se pudieron cargar las citas.", "error");
        } finally {
            setIsLoading(false);
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
            Swal.fire("Actualizada", "El estado de la cita ha sido actualizado", "success");
            fetchAppointments();
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            const msg = error.response?.data?.message || "No se pudo actualizar la cita";
            Swal.fire("Error", msg, "error");
        }
    };

    const deleteAppointment = async (id) => {
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
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return {
        appointments,
        isLoading,
        updateStatus,
        deleteAppointment,
    };
};

// --- Componente para el Calendario
const AppointmentsCalendar = ({ appointments }) => {
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedDayAppointments, setSelectedDayAppointments] = useState(null);

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const appointmentsByDay = useMemo(() => {
        const map = {};
        appointments.forEach(cita => {
            const date = new Date(cita.dateTime);
            const dayKey = date.toISOString().split('T')[0];
            if (!map[dayKey]) {
                map[dayKey] = [];
            }
            map[dayKey].push(cita);
        });
        return map;
    }, [appointments]);

    const getCalendarDays = () => {
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDayOfWeek = firstDayOfMonth.getDay();

        const calendarDays = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(i);
        }
        return calendarDays;
    };

    const hasAppointmentOnDay = (day) => {
        if (!day) return false;
        const dateKey = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toISOString().split('T')[0];
        return !!appointmentsByDay[dateKey];
    };

    const handleDayClick = (day) => {
        if (!day) return;
        const dateKey = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toISOString().split('T')[0];
        setSelectedDayAppointments(appointmentsByDay[dateKey] || []);
    };
    
    const getStatusBadge = (status) => {
        const base = "px-2 py-1 rounded-full text-xs font-semibold";
        switch (status) {
            case "pendiente": return `${base} bg-yellow-100 text-yellow-700`;
            case "completada": return `${base} bg-green-100 text-green-700`;
            case "cancelada": return `${base} bg-red-100 text-red-700`;
            default: return `${base} bg-gray-100 text-gray-700`;
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition">&lt;</button>
                <h3 className="text-xl font-semibold text-gray-800">
                    {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </h3>
                <button onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-bold mb-2">
                {daysOfWeek.map(day => <div key={day} className="day-header">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {getCalendarDays().map((day, index) => (
                    <div 
                        key={index}
                        className={`p-2 rounded-lg cursor-pointer transition
                            ${day ? 'bg-gray-100 hover:bg-gray-200' : 'bg-transparent cursor-default'}
                            ${hasAppointmentOnDay(day) ? 'bg-pink-100 hover:bg-pink-200' : ''}`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day}
                        {hasAppointmentOnDay(day) && (
                            <div className="h-2 w-2 bg-pink-500 rounded-full mx-auto mt-1"></div>
                        )}
                    </div>
                ))}
            </div>

            {selectedDayAppointments && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                    <h4 className="font-semibold text-lg mb-2">
                      Citas para el día: {new Date(calendarDate.getFullYear(), calendarDate.getMonth(), selectedDayAppointments[0] ? new Date(selectedDayAppointments[0].dateTime).getDate() : null).toLocaleDateString()}
                    </h4>
                    {selectedDayAppointments.length > 0 ? (
                        selectedDayAppointments.map(appointment => (
                            <div key={appointment._id} className="p-3 border rounded-lg bg-white mb-2 shadow-sm">
                                <p className="font-medium">{appointment.serviceId?.name}</p>
                                <p className="text-sm text-gray-600">Cliente: {appointment.clientId?.name}</p>
                                <p className="text-sm text-gray-600">Empleado: {appointment.employeeId?.name}</p>
                                <p className="text-sm text-gray-600">Hora: {new Date(appointment.dateTime).toLocaleTimeString()}</p>
                                <span className={`text-xs ${getStatusBadge(appointment.status)}`}>{appointment.status}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay citas para este día.</p>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Componente principal de la aplicación
export default function App() {
    const { appointments, isLoading, updateStatus, deleteAppointment } = useAppointments();

    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [activeTab, setActiveTab] = useState("table");
    const [showDeleteModal, setShowDeleteModal] = useState(null);

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
            case "pendiente": return `${base} bg-yellow-100 text-yellow-700`;
            case "completada": return `${base} bg-green-100 text-green-700`;
            case "cancelada": return `${base} bg-red-100 text-red-700`;
            default: return `${base} bg-gray-100 text-gray-700`;
        }
    };

    const confirmDelete = () => {
        if (showDeleteModal) {
            deleteAppointment(showDeleteModal);
            setShowDeleteModal(null);
        }
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
                        activeTab === "table" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Tabla
                </button>
                <button
                    onClick={() => setActiveTab("calendar")}
                    className={`px-4 py-2 rounded-lg shadow transition ${
                        activeTab === "calendar" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Calendario
                </button>
            </div>

            {isLoading ? (
                <div className="text-center text-gray-500 py-12">
                    Cargando citas...
                </div>
            ) : (
                activeTab === "table" ? (
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
                                            <tr key={cita._id} className={`border-b ${i % 2 === 0 ? "bg-pink-50" : "bg-white"}`}>
                                                <td className="py-2 px-4">{cita.clientId?.name || "Sin nombre"}</td>
                                                <td className="py-2 px-4">{cita.serviceId?.name || "Sin servicio"}</td>
                                                <td className="py-2 px-4">{cita.employeeId?.name || "Sin empleado"}</td>
                                                <td className="py-2 px-4">{new Date(cita.dateTime).toLocaleString()}</td>
                                                <td className="py-2 px-4">
                                                    <span className={getStatusBadge(cita.status)}>{cita.status}</span>
                                                </td>
                                                <td className="py-2 px-4 flex gap-2">
                                                    <select
                                                        value={cita.status}
                                                        onChange={(e) => updateStatus(cita._id, e.target.value)}
                                                        className="border border-pink-300 bg-white px-2 py-1 rounded-lg focus:ring-2 focus:ring-pink-400"
                                                    >
                                                        <option value="pendiente">Pendiente</option>
                                                        <option value="completada">Completada</option>
                                                        <option value="cancelada">Cancelada</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setShowDeleteModal(cita._id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="py-4 px-4 text-center text-gray-500" colSpan={6}>
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
                )
            )}

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">¿Eliminar cita?</h3>
                        <p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
