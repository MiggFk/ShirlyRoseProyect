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

export default AppointmentsCalendar;