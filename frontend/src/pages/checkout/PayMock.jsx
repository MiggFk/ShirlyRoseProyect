import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function PayMock() {
  const { intentId } = useParams();
  const navigate = useNavigate();
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/payments/intent/${intentId}`);
      setIntent(res.data.intent);
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo cargar el pago");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [intentId]);

  const doPay = async (outcome) => {
    setProcessing(true);
    setError("");
    try {
      const res = await api.post("/payments/mock/pay", { intentId, outcome });
      if (res.data?.appointmentId) {
        navigate(`/checkout/success?appointment=${res.data.appointmentId}&invoice=${res.data.invoiceId}`);
      } else {
        await load();
      }
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo procesar el pago");
      await load();
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!intent) return <div className="p-6">Pago no encontrado.</div>;

  const expired = intent.status === "expired";

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 bg-white border rounded">
      <h1 className="text-xl font-bold">Pago</h1>
      <div className="text-sm text-gray-600">
        <p>Estado: <b>{intent.status}</b></p>
        <p>Total: <b>${intent.amount?.toLocaleString()}</b></p>
        <p>Expira: {new Date(intent.expiresAt).toLocaleString()}</p>
      </div>

      {error && <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

      {expired ? (
        <div className="p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800">
          El intento de pago expiró. Vuelve al checkout para generar uno nuevo.
        </div>
      ) : intent.status === "succeeded" ? (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
          Pago confirmado. Procesando reserva...
        </div>
      ) : (
        <div className="flex gap-2">
          <button disabled={processing} onClick={() => doPay("succeeded")} className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">
            Simular pago exitoso
          </button>
          <button disabled={processing} onClick={() => doPay("failed")} className="px-4 py-2 rounded border">
            Simular fallo
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button className="px-4 py-2 rounded border" onClick={() => navigate("/checkout")}>Volver al checkout</button>
        <button className="px-4 py-2 rounded" onClick={() => load()}>Actualizar</button>
      </div>
    </div>
  );
}