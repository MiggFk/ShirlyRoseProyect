import { useEffect, useState } from "react";
import axios from "axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(response.data.data || response.data); // soporta ambas respuestas
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments(); // refrescar lista después de cambiar estado
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("No se pudo actualizar la cita");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Citas registradas</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Servicio</th>
              <th className="py-3 px-4">Empleado</th>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((cita) => (
                <tr key={cita._id} className="border-b">
                  <td className="py-2 px-4">{cita.clientId?.name || "Sin nombre"}</td>
                  <td className="py-2 px-4">{cita.serviceId?.name || "Sin servicio"}</td>
                  <td className="py-2 px-4">{cita.employeeId?.name || "Sin empleado"}</td>
                  <td className="py-2 px-4">
                    {new Date(cita.dateTime).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 capitalize">{cita.status}</td>
                  <td className="py-2 px-4">
                    <select
                      value={cita.status}
                      onChange={(e) => updateStatus(cita._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="completed">Completada</option>
                      <option value="canceled">Cancelada</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-4 text-center text-gray-500" colSpan={6}>
                  No hay citas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}