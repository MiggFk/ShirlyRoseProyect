import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AppointmentsCalendar = ({ appointments }) => {
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // 🔧 FIX: Agrupar citas por día correctamente
    const appointmentsByDay = useMemo(() => {
        const map = {};
        appointments.forEach(cita => {
            const date = new Date(cita.dateTime);
            const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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

    // 🔧 FIX: Verificar correctamente si hay citas
    const hasAppointmentOnDay = (day) => {
        if (!day) return false;
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return !!appointmentsByDay[dateKey];
    };

    // 🔧 FIX: Obtener citas del día correcto
    const getAppointmentsForDay = (day) => {
        if (!day) return [];
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return appointmentsByDay[dateKey] || [];
    };

    // 🔧 FIX: Manejar clic en día
    const handleDayClick = (day) => {
        if (!day) return;
        setSelectedDay(day);
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

    const selectedDayAppointments = selectedDay ? getAppointmentsForDay(selectedDay) : null;

    return (
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-lg mt-6">
            {/* Header con navegación */}
            <div className="flex justify-between items-center mb-6">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
                        setSelectedDay(null);
                    }}
                    className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-4 py-2 rounded-2xl hover:bg-white/20 transition shadow-md"
                >
                    ←
                </motion.button>
                <h3 className="text-2xl font-bold text-white">
                    {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </h3>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
                        setSelectedDay(null);
                    }}
                    className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-4 py-2 rounded-2xl hover:bg-white/20 transition shadow-md"
                >
                    →
                </motion.button>
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
                {getCalendarDays().map((day, index) => {
                    const hasAppointments = hasAppointmentOnDay(day);
                    const isSelected = selectedDay === day;
                    const appointmentsCount = day ? getAppointmentsForDay(day).length : 0;

                    return (
                        <motion.div 
                            key={index}
                            whileHover={day ? { scale: 1.05 } : {}}
                            whileTap={day ? { scale: 0.95 } : {}}
                            className={`
                                p-3 rounded-xl transition-all duration-300 text-center font-medium relative
                                ${day ? 'cursor-pointer' : 'cursor-default'}
                                ${!day ? 'bg-transparent' : ''}
                                ${day && !hasAppointments && !isSelected ? 'bg-white/5 hover:bg-white/15 text-white' : ''}
                                ${day && hasAppointments && !isSelected ? 'bg-rose-400/30 hover:bg-rose-400/40 backdrop-blur-xl border border-rose-300/30 text-white' : ''}
                                ${isSelected ? 'bg-rose-500 text-white shadow-lg ring-2 ring-white/50' : ''}
                            `}
                            onClick={() => handleDayClick(day)}
                        >
                            {day}
                            {hasAppointments && (
                                <div className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {appointmentsCount}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Citas del día seleccionado */}
            <AnimatePresence>
                {selectedDayAppointments && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-lg"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-lg text-white">
                                Citas del {selectedDay} de {months[calendarDate.getMonth()]}
                            </h4>
                            <span className="text-white/70 text-sm">
                                {selectedDayAppointments.length} cita{selectedDayAppointments.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {selectedDayAppointments.length > 0 ? (
                            <div className="space-y-3">
                                {selectedDayAppointments.map((appointment, index) => (
                                    <motion.div 
                                        key={appointment._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-xl shadow-md hover:bg-white/15 transition"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-white text-lg">
                                                {appointment.serviceId?.name || 'Servicio no especificado'}
                                            </p>
                                            <span className={getStatusBadge(appointment.status)}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-1 text-white/80 text-sm">
                                            <p>
                                                <span className="font-semibold">Cliente:</span> {appointment.clientId?.name || 'N/A'}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Especialista:</span> {appointment.employeeId?.name || 'N/A'}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Hora:</span> {new Date(appointment.dateTime).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-white/70 text-lg">📅 No hay citas para este día</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Leyenda */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-white/70">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-400/30 border border-rose-300/30"></div>
                    <span>Días con citas</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-500"></div>
                    <span>Día seleccionado</span>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsCalendar;