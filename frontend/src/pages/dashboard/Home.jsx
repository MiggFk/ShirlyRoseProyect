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
} from "lucide-react";

import { useStats } from "../../hooks/useStats";

export default function Home() {
  const { stats, loading } = useStats();

  // 🔹 Validar que stats tenga la estructura correcta
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
    { name: "Pendientes", value: safeStats.status.pending, color: "#facc15" },
    { name: "Completadas", value: safeStats.status.completed, color: "#22c55e" },
    { name: "Canceladas", value: safeStats.status.cancelled, color: "#ef4444" },
  ];
  
  const serviceColors = ["#ec4899", "#3b82f6", "#22c55e", "#f97316", "#a855f7"];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-pink-600">
        Bienvenido al panel de administración
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Tarjetas métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Citas</h3>
                <p className="text-3xl font-bold">{safeStats.totalAppointments}</p>
              </div>
              <CalendarDays size={40} />
            </div>

            <div className="bg-yellow-100 text-yellow-800 p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Pendientes</h3>
                <p className="text-3xl font-bold">{safeStats.status.pending}</p>
              </div>
              <Clock size={40} />
            </div>

            <div className="bg-green-100 text-green-800 p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Completadas</h3>
                <p className="text-3xl font-bold">{safeStats.status.completed}</p>
              </div>
              <CheckCircle size={40} />
            </div>

            <div className="bg-red-100 text-red-800 p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Canceladas</h3>
                <p className="text-3xl font-bold">{safeStats.status.cancelled}</p>
              </div>
              <XCircle size={40} />
            </div>
          </div>

          {/* Citas por estado */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">
              Citas por estado
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Citas por mes + Servicios más solicitados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-pink-600">
                Citas por mes
              </h2>
              {safeStats.monthly.length === 0 ? (
                <p className="text-gray-500">No hay datos suficientes aún.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={safeStats.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-pink-600">
                Servicios más solicitados
              </h2>
              {safeStats.services.length === 0 ? (
                <p className="text-gray-500">No hay datos suficientes aún.</p>
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
                    >
                      {safeStats.services.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={serviceColors[index % serviceColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}