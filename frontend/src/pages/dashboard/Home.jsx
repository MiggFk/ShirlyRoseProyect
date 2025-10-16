import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { 
  CalendarDays, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  Star
} from "lucide-react";
import { useStats } from "../../hooks/useStats";
import { useAdvancedStats } from "../../hooks/useAdvancedStats";

export default function Home() {
  const { stats, loading } = useStats();
  const { advancedStats, loading: advancedLoading } = useAdvancedStats();

  const safeStats = {
    totalAppointments: stats?.totalAppointments || 0,
    status: {
      pending: stats?.status?.pending || 0,
      completed: stats?.status?.completed || 0,
      cancelled: stats?.status?.cancelled || 0,
    },
    services: stats?.services || [],
    monthly: stats?.monthly || [],
  };

  // 🔹 Función para normalizar categorías
  const normalizeCategory = (category) => {
    if (!category) return 'Belleza';
    
    const cleanCategory = String(category).trim();
    
    const categoryMap = {
      'unas': 'Uñas',
      'uñas': 'Uñas',
      'nails': 'Uñas',
      'manicure': 'Uñas',
      'pedicure': 'Uñas',
      'manicure_pedicure': 'Uñas',
      'manicure y pedicure': 'Uñas',
      
      'pestañas': 'Pestañas',
      'pestanas': 'Pestañas',
      'lashes': 'Pestañas',
      'extensiones': 'Pestañas',
      
      'cejas': 'Cejas',
      'brows': 'Cejas',
      
      'faciales': 'Faciales',
      'facial': 'Faciales',
      'piel': 'Faciales',
      'skin': 'Faciales',
      
      'depilacion': 'Depilación',
      'depilación': 'Depilación',
      'waxing': 'Depilación',
      
      'corporales': 'Corporales',
      'masaje': 'Corporales',
      'massage': 'Corporales'
    };
    
    const normalized = categoryMap[cleanCategory.toLowerCase()];
    if (normalized) return normalized;
    
    return cleanCategory.charAt(0).toUpperCase() + cleanCategory.slice(1);
  };

  const statusData = [
    { name: "Pendientes", value: safeStats.status.pending, color: "#e4476eff" },
    { name: "Completadas", value: safeStats.status.completed, color: "#ff5c84ff" },
    { name: "Canceladas", value: safeStats.status.cancelled, color: "#ff98b2ff" },
  ];

  const serviceColors = ["#c0395aff", "#ff295fff", "#ff7d99ff", "#ff006aff", "#ffabd1ff"];

  const isLoading = loading || advancedLoading;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-5xl font-bold text-white drop-shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Bienvenido al panel de administración
      </motion.h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* 📊 Tarjetas métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/30 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between transition-all"
            >
              <div>
                <h3 className="text-lg font-semibold">Total Citas</h3>
                <p className="text-3xl font-bold">{safeStats.totalAppointments}</p>
              </div>
              <CalendarDays size={40} className="opacity-80" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/30 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between transition-all"
            >
              <div>
                <h3 className="text-lg font-semibold">Pendientes</h3>
                <p className="text-3xl font-bold">{safeStats.status.pending}</p>
              </div>
              <Clock size={40} className="opacity-80" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/30 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between transition-all"
            >
              <div>
                <h3 className="text-lg font-semibold">Completadas</h3>
                <p className="text-3xl font-bold">{safeStats.status.completed}</p>
              </div>
              <CheckCircle size={40} className="opacity-80" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/30 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between transition-all"
            >
              <div>
                <h3 className="text-lg font-semibold">Canceladas</h3>
                <p className="text-3xl font-bold">{safeStats.status.cancelled}</p>
              </div>
              <XCircle size={40} className="opacity-80" />
            </motion.div>
          </div>

          {/* 💰 Estadísticas Financieras - Grid 2 columnas */}
          {advancedStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/30 text-white p-6 rounded-3xl shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Ingresos del Mes</h3>
                  <DollarSign size={40} className="opacity-80" />
                </div>
                <p className="text-4xl font-bold mb-3">
                  ${advancedStats.revenue.monthly.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <TrendingUp size={16} />
                  <span className={advancedStats.revenue.growth >= 0 ? "text-green-300" : "text-red-300"}>
                    {advancedStats.revenue.growth > 0 ? "+" : ""}{advancedStats.revenue.growth}% vs mes anterior
                  </span>
                </div>
                <p className="text-sm opacity-80">
                  Ticket promedio: <span className="font-semibold">${advancedStats.revenue.averageTicket.toLocaleString()}</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/30 text-white p-6 rounded-3xl shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Clientes</h3>
                  <Users size={40} className="opacity-80" />
                </div>
                <p className="text-4xl font-bold mb-3">{advancedStats.clients.total}</p>
                <p className="text-sm mb-2">
                  <span className="text-blue-300 font-semibold">+{advancedStats.clients.newThisMonth}</span> nuevos este mes
                </p>
                <p className="text-sm opacity-80">
                  <span className="font-semibold">{advancedStats.clients.recurringRate}%</span> clientes recurrentes
                </p>
              </motion.div>
            </div>
          )}

          {/* 📊 Citas por estado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/30 p-6 rounded-3xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Citas por estado
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "12px",
                    color: "#000",
                  }}
                  labelStyle={{ color: "#000" }}
                  itemStyle={{ color: "#000" }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 🕒 Horarios Pico y Días más Ocupados */}
          {advancedStats && advancedStats.performance.peakHours.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/30 p-6 rounded-3xl shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
                  <Activity size={24} />
                  Horarios Pico
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={advancedStats.performance.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="hour" stroke="rgba(255,255,255,0.7)" />
                    <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.7)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "12px",
                        color: "#000",
                      }}
                    />
                    <Bar dataKey="appointments" fill="#ff7b9cff" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/30 p-6 rounded-3xl shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  Días más Ocupados
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={advancedStats.performance.busiestDays}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                    <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.7)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "12px",
                        color: "#000",
                      }}
                    />
                    <Bar dataKey="appointments" fill="#c0395aff" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* 📅 Citas por mes + Servicios más solicitados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/30 p-6 rounded-3xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Citas por mes
              </h2>
              {safeStats.monthly.length === 0 ? (
                <p className="text-gray-300">No hay datos suficientes aún.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={safeStats.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                    <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.7)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "12px",
                        color: "#000",
                      }}
                      labelStyle={{ color: "#000" }}
                      itemStyle={{ color: "#000" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#ff7b9cff"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/30 p-6 rounded-3xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Servicios más solicitados
              </h2>
              {safeStats.services.length === 0 ? (
                <p className="text-gray-300">No hay datos suficientes aún.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={safeStats.services}
                      dataKey="count"
                      nameKey="service"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                      stroke="none"
                      strokeWidth={0}
                    >
                      {safeStats.services.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={serviceColors[index % serviceColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "12px",
                        color: "#000",
                      }}
                      labelStyle={{ color: "#000" }}
                      itemStyle={{ color: "#000" }}
                    />
                    <Legend
                      wrapperStyle={{
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* ⭐ Top 5 Servicios por Ingresos con diseño mejorado */}
          {advancedStats && advancedStats.performance.topServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/30 p-6 rounded-3xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <Star size={28} className="text-yellow-400" />
                <h2 className="text-2xl font-semibold text-white">
                  Top 5 Servicios por Ingresos (Este Mes)
                </h2>
              </div>
              <div className="space-y-4">
                {advancedStats.performance.topServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl hover:bg-white/15 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{service.name}</p>
                        <p className="text-sm text-gray-300">
                          {normalizeCategory(service.category)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">
                        ${service.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-300">
                        {service.count} {service.count === 1 ? 'reserva' : 'reservas'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}