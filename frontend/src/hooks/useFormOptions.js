import { useState, useEffect } from "react";
import api from "../api/axios";

export const useFormOptions = () => {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.warn("No hay token disponible");
          setLoading(false);
          return;
        }

        // 🔹 Cargar usuarios y servicios en paralelo
        const [usersRes, servicesRes] = await Promise.all([
          api.get("/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/services", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("👥 Usuarios cargados:", usersRes.data);
        console.log("💅 Servicios cargados:", servicesRes.data);

        // 🔹 Filtrar usuarios por rol
        const allUsers = usersRes.data || [];
        
        const clientUsers = allUsers.filter(user => 
          user && user._id && user.name && user.role === "cliente"
        );
        
        const employeeUsers = allUsers.filter(user => 
          user && user._id && user.name && (user.role === "empleado" || user.role === "admin")
        );

        console.log("👤 Clientes filtrados:", clientUsers.length);
        console.log("👨‍💼 Empleados filtrados:", employeeUsers.length);

        setClients(clientUsers);
        setEmployees(employeeUsers);
        setServices(servicesRes.data || []);
      } catch (error) {
        console.error("❌ Error al cargar opciones:", error);
        
        // Si el error es de autenticación, no hacer nada (el interceptor se encarga)
        if (error.response?.status === 401) {
          console.warn("Sesión expirada o no válida");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return { 
    clients, 
    services, 
    employees, 
    loading,
    hasClients: clients.length > 0,
    hasServices: services.length > 0,
    hasEmployees: employees.length > 0,
  };
};