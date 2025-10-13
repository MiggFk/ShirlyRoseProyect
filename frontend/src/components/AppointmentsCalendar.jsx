import React, { useState, useMemo } from "react";

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
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-lg mt-6">
            {/* Header con navegación */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} 
                    className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-4 py-2 rounded-2xl hover:bg-white/20 transition shadow-md"
                >
                    &lt;
                </button>
                <h3 className="text-2xl font-bold text-white">
                    {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </h3>
                <button 
                    onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} 
                    className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-4 py-2 rounded-2xl hover:bg-white/20 transition shadow-md"
                >
                    &gt;
                </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 text-center font-bold mb-4">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-white/80 text-sm py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7 gap-2">
                {getCalendarDays().map((day, index) => (
                    <div 
                        key={index}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-300 text-center font-medium
                            ${day ? 'bg-white/5 hover:bg-white/15 text-white' : 'bg-transparent cursor-default'}
                            ${hasAppointmentOnDay(day) ? 'bg-rose-400/30 hover:bg-rose-400/40 backdrop-blur-xl border border-rose-300/30' : ''}`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day}
                        {hasAppointmentOnDay(day) && (
                            <div className="h-2 w-2 bg-rose-500 rounded-full mx-auto mt-1"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Citas del día seleccionado */}
            {selectedDayAppointments && (
                <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-lg">
                    <h4 className="font-semibold text-lg mb-4 text-white">
                      Citas para el día: {new Date(calendarDate.getFullYear(), calendarDate.getMonth(), selectedDayAppointments[0] ? new Date(selectedDayAppointments[0].dateTime).getDate() : null).toLocaleDateString()}
                    </h4>
                    {selectedDayAppointments.length > 0 ? (
                        selectedDayAppointments.map(appointment => (
                            <div key={appointment._id} className="p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-xl mb-3 shadow-md">
                                <p className="font-medium text-white text-lg">{appointment.serviceId?.name}</p>
                                <p className="text-sm text-white/80 mt-1">Cliente: {appointment.clientId?.name}</p>
                                <p className="text-sm text-white/80">Empleado: {appointment.employeeId?.name}</p>
                                <p className="text-sm text-white/80">Hora: {new Date(appointment.dateTime).toLocaleTimeString()}</p>
                                <span className={`inline-block mt-2 ${getStatusBadge(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-white/70">No hay citas para este día.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppointmentsCalendar;