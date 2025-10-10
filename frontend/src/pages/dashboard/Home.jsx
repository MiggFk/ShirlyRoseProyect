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
import { CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";
import { useStats } from "../../hooks/useStats";

export default function Home() {
  const { stats, loading } = useStats();

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

  const statusData = [
    { name: "Pendientes", value: safeStats.status.pending, color: "#e4476eff" },
    { name: "Completadas", value: safeStats.status.completed, color: "#ff5c84ff" },
    { name: "Canceladas", value: safeStats.status.cancelled, color: "#ff98b2ff" },
  ];

  const serviceColors = ["#c0395aff", "#ff295fff", "#ff7d99ff", "#ff006aff", "#ffabd1ff"];

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Tarjetas métricas con efecto glass */}
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

          {/* Citas por estado con efecto glass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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

          {/* Citas por mes + Servicios más solicitados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
              transition={{ delay: 0.7 }}
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
        </>
      )}
    </motion.div>
  );
}