import { useState, useEffect } from "react";
import api from "../api/axios";

export function useStats() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    status: { pending: 0, completed: 0, cancelled: 0 },
    services: [],
    monthly: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/appointments/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading };
}