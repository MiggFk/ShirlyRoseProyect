import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export function useFormOptions() {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [resClients, resServices, resEmployees] = await Promise.all([
        api.get("/clients", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/services", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/users", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      // Normalizamos clientes
      setClients(
        resClients.data.map((c) => ({
          _id: c._id,
          name: c.usuarioId?.name || "Cliente sin usuario",
          email: c.usuarioId?.email || "Sin correo",
        }))
      );

      // Servicios van directo
      setServices(resServices.data);

      // Solo usuarios con rol empleado
      setEmployees(resEmployees.data.filter((u) => u.role === "empleado"));
    } catch (error) {
      console.error("Error cargando opciones:", error);
      Swal.fire("Error", "No se pudieron cargar las opciones del formulario", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { clients, services, employees };
}
