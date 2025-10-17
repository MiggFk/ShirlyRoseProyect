import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Success() {
  const qs = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();
  const appointmentId = qs.get("appointment");
  const invoiceId = qs.get("invoice");

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 bg-white border rounded text-center">
      <div className="text-3xl">🎉</div>
      <h1 className="text-xl font-bold">¡Reserva confirmada!</h1>
      <p className="text-sm text-gray-600">Tu pago fue procesado correctamente.</p>
      <div className="text-sm">
        <p><b>Cita:</b> {appointmentId}</p>
        <p><b>Factura:</b> {invoiceId}</p>
      </div>
      <div className="flex gap-2 justify-center">
        <button className="px-4 py-2 rounded bg-rose-500 text-white" onClick={()=>navigate("/appointments")}>Ver mis citas</button>
        <button className="px-4 py-2 rounded border" onClick={()=>navigate("/")}>Inicio</button>
      </div>
    </div>
  );
}