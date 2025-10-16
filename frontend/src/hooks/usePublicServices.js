import { useState, useEffect } from 'react';
import api from "../api/axios"; // ← Usar el mismo api que productos

export function usePublicServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => { // ← CORREGIDO: era "fisearch"
    try {
      setLoading(true);
      setError(null);
      
      // IMPORTANTE: Sin headers de autorización para rutas públicas
      const response = await api.get("/services"); // ← Usar api consistente
      
      console.log('✅ Servicios públicos cargados:', response.data);
      setServices(response.data);
    } catch (err) {
      console.error('❌ Error fetching public services:', err);
      setError('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(); // ← CORREGIDO: era "fisearch"
  }, []);

  return { 
    services, 
    loading, 
    error, 
    refetch: fetchServices // ← CORREGIDO: era "fisearch"
  };
}