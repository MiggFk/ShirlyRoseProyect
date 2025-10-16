import { useState, useEffect } from "react";
import api from "../api/axios";

export function useAdvancedStats() {
  const [advancedStats, setAdvancedStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdvancedStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/appointments/advanced-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAdvancedStats(res.data.data);
    } catch (error) {
      console.error("Error al cargar estadísticas avanzadas:", error);
      setAdvancedStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvancedStats();
  }, []);

  return { advancedStats, loading, refresh: fetchAdvancedStats };
}