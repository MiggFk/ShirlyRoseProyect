import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export function useFormOptions() {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const fetchData = async () => {
    try {
      // Ya no se necesita obtener el token manualmente. AuthContext lo gestiona.
      
      // CRÍTICO: Usamos api.get() directo. AuthContext ya configuró el header de Authorization globalmente.
      const [resClients, resServices, resEmployees] = await Promise.all([
        api.get("/clients"), // Se envía el token automáticamente
        api.get("/services"), // Se envía el token automáticamente
        api.get("/users"), // Se envía el token automáticamente
      ]); //

      // 🔹 Lógica de Mapeo de Clientes (Se mantiene)
      setClients(
        resClients.data.map((c) => ({
          _id: c.usuarioId?.user || c._id, 
          name: c.usuarioId?.name || "Cliente sin usuario",
          email: c.usuarioId?.email || "Sin correo",
        }))
      ); //

      // Servicios van directo
      setServices(resServices.data); //

      // Solo usuarios con rol empleado
      setEmployees(resEmployees.data.filter((u) => u.role === "empleado")); //
    } catch (error) {
      console.error("Error cargando opciones:", error.response?.data?.message || error.message);
      // Incluimos un manejo de error más informativo
      const errorMessage = error.response?.data?.message || "Error de conexión o token expirado. Intente iniciar sesión de nuevo."; //
      Swal.fire("Error", errorMessage, "error"); //
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { clients, services, employees };
}