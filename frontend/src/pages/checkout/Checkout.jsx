import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CalendarMonth from "../../components/checkout/CalendarMonth";
import TimeSlots from "../../components/checkout/TimeSlots";
import {
  formatLocalDatetimeForDisplay,
  getUserTimezoneName,
} from "../../utils/datetime";

/**
 * Checkout page
 *
 * - Reusa el contexto del carrito y el auth context
 * - Muestra stepper (datos, servicio/profesional, fecha/hora, resumen)
 * - Usa CalendarMonth / TimeSlots (TimeSlots devuelve ISO UTC)
 * - Formatea la fecha para la vista con utils/datetime
 * - Envía al backend: { cart, appointment: { employeeId, serviceId, dateTime }, customer }
 * - Requiere login para finalizar; si no hay user => redirige a login
 */

// Mejora visual del Step
const Step = ({ n, current, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={[
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition",
        current === n
          ? "bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow"
          : current > n
          ? "bg-emerald-500 text-white"
          : "bg-slate-200 text-slate-600",
      ].join(" ")}
    >
      {n}
    </div>
    <span className={current >= n ? "text-sm text-slate-900" : "text-sm text-slate-500"}>{label}</span>
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();

  // Steps
  const [step, setStep] = useState(1);

  // Customer data (prefill from user when available)
  const [customer, setCustomer] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    notes: "",
  });

  // Selection state
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Date/time
  // date: "YYYY-MM-DD" selected from calendar (local)
  // dateTimeISO: ISO string in UTC returned from TimeSlots onPick
  const [date, setDate] = useState("");
  const [dateTimeISO, setDateTimeISO] = useState(null);

  // UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation booleans
  const canStep1 = useMemo(() => !!(customer.name && customer.email), [customer]);
  const canStep2 = useMemo(() => !!(employeeId && serviceId), [employeeId, serviceId]);
  const canStep3 = useMemo(() => !!(date && dateTimeISO), [date, dateTimeISO]);

  // Load catalogues
  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, srvRes] = await Promise.all([api.get("/employees"), api.get("/services")]);
        setEmployees(empRes.data?.employees || empRes.data || []);
        setServices(srvRes.data?.services || srvRes.data || []);
      } catch (e) {
        console.error("Error cargando catálogos:", e);
      }
    };
    load();
  }, []);

  // Prefill service/employee/date from first servicio in cart (si existe)
  useEffect(() => {
    const srvItem = cart?.find(i => i.type === "servicio" || i.kind === "servicio" || i.kind === "service");
    if (srvItem) {
      if (!serviceId) setServiceId(srvItem._id || srvItem.id);
      if (!employeeId && srvItem.employeeId) setEmployeeId(srvItem.employeeId);
      if (!dateTimeISO && srvItem.dateTime) {
        const iso = new Date(srvItem.dateTime).toISOString();
        setDate(iso.slice(0, 10));
        setDateTimeISO(iso);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  // Map IDs -> selected objects for display
  useEffect(() => {
    setSelectedEmployee(employees.find(e => e._id === employeeId) || null);
  }, [employeeId, employees]);

  useEffect(() => {
    setSelectedService(services.find(s => (s._id || s.id) === serviceId) || null);
  }, [serviceId, services]);

  // Auto-advance step when possible
  useEffect(() => {
    if (customer.name && customer.email && employeeId && serviceId && date && dateTimeISO) {
      setStep(4);
    } else if (customer.name && customer.email && employeeId && serviceId) {
      setStep(prev => Math.max(prev, 3));
    } else if (customer.name && customer.email) {
      setStep(prev => Math.max(prev, 2));
    }
  }, [customer, employeeId, serviceId, date, dateTimeISO]);

  // Handlers
  const handleCustomerChange = (field) => (e) => setCustomer(prev => ({ ...prev, [field]: e.target.value }));

  // Confirm: create checkout intent and redirect to pay page
  const handleConfirm = async () => {
    setError("");
    if (!user) {
      // Enforce login before creating the appointment (per flow)
      // Redirect to login preserving returnTo
      navigate("/login?next=/checkout");
      return;
    }
    if (!canStep3) {
      setError("Completa todos los pasos antes de continuar.");
      return;
    }
    setLoading(true);
    try {
      const body = {
        cart,
        appointment: {
          employeeId,
          serviceId,
          dateTime: dateTimeISO, // ISO UTC from TimeSlots
        },
        customer,
        // userId optional: backend prioritizes req.user; include for redundancy if needed
        userId: user?._id || user?.id || null,
      };
      const res = await api.post("/payments/checkout", body);
      const intentId = res.data?.intentId || (res.data && res.data.intentId);
      if (!intentId) {
        throw new Error("No se pudo generar intento de pago.");
      }
      // vacuum cart client-side: backend will finalize after payment; but keep UX consistent
      clearCart();
      navigate(`/pay/${intentId}`);
    } catch (err) {
      console.error("checkout error:", err);
      setError(err?.response?.data?.message || err?.message || "Error iniciando checkout");
    } finally {
      setLoading(false);
    }
  };

  // small helpers
  const itemsCount = cart.reduce((s, i) => s + (i.cantidad || 1), 0);
  const serviceDuration = useMemo(() => selectedService?.durationMinutes || selectedService?.duration || 30, [selectedService]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HERO + STEPPER */}
      <header className="rounded-2xl overflow-hidden border">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-8 text-white">
          <h1 className="text-2xl font-bold">Reserva tu cita</h1>
          <p className="text-white/90 text-sm mt-1">Elige servicio, profesional, fecha y paga en segundos.</p>
        </div>
        <div className="bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <Step n={1} current={step} label="Tus datos" />
            <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
            <Step n={2} current={step} label="Servicio y profesional" />
            <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
            <Step n={3} current={step} label="Fecha y hora" />
            <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
            <Step n={4} current={step} label="Resumen y pago" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Paso 1: Datos */}
          {step === 1 && (
            <section className="bg-white rounded-xl border p-4 space-y-4">
              <h2 className="font-semibold">Tus datos</h2>
              {!user && <p className="text-sm text-slate-500">Puedes reservar como invitado, pero necesitarás iniciar sesión para completar la reserva.</p>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className="border p-2 rounded" placeholder="Nombre" value={customer.name} onChange={handleCustomerChange("name")} />
                <input className="border p-2 rounded" placeholder="Email" value={customer.email} onChange={handleCustomerChange("email")} />
                <input className="border p-2 rounded" placeholder="Teléfono" value={customer.phone} onChange={handleCustomerChange("phone")} />
              </div>
              <textarea className="border p-2 rounded w-full" rows={3} placeholder="Notas o preferencias (opcional)" value={customer.notes} onChange={handleCustomerChange("notes")} />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 rounded bg-rose-500 text-white disabled:opacity-50"
                  disabled={!canStep1}
                  onClick={() => setStep(2)}
                >
                  Continuar
                </button>
              </div>
            </section>
          )}

          {/* Paso 2: Tarjetas con mejor UI (sin IDs visibles) */}
          {step === 2 && (
            <section className="bg-white rounded-2xl border p-5 space-y-6">
              <h2 className="font-semibold text-lg">Elige tu servicio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.length === 0 ? (
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-xl border bg-slate-50 animate-pulse" />
                    <div className="h-24 rounded-xl border bg-slate-50 animate-pulse" />
                  </div>
                ) : services.map(s => {
                  const selected = (s._id || s.id) === serviceId;
                  return (
                    <button
                      key={s._id || s.id}
                      type="button"
                      onClick={()=>setServiceId(s._id || s.id)}
                      className={[
                        "text-left p-4 rounded-xl border transition group",
                        selected
                          ? "border-rose-500 bg-rose-50 ring-2 ring-rose-200 shadow"
                          : "border-slate-200 hover:border-rose-300 hover:bg-rose-50/40"
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{s.name}</div>
                        {selected && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white">Seleccionado</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {s.durationMinutes || s.duration ? `${s.durationMinutes || s.duration} min` : "Duración variable"}
                        {s.price ? ` • $${s.price.toLocaleString?.() || s.price}` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>

              <h2 className="font-semibold text-lg">Elige profesional</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employees.length === 0 ? (
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="h-20 rounded-xl border bg-slate-50 animate-pulse" />
                    <div className="h-20 rounded-xl border bg-slate-50 animate-pulse" />
                  </div>
                ) : employees.map(e => {
                  const selected = e._id === employeeId;
                  return (
                    <button
                      key={e._id}
                      type="button"
                      onClick={()=>setEmployeeId(e._id)}
                      className={[
                        "p-4 rounded-xl border flex items-center gap-3 transition",
                        selected
                          ? "border-rose-500 bg-rose-50 ring-2 ring-rose-200 shadow"
                          : "border-slate-200 hover:border-rose-300 hover:bg-rose-50/40"
                      ].join(" ")}
                    >
                      <img src={e.profileImage || "https://via.placeholder.com/64"} alt={e.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold">{e.name}</div>
                        {e.phone && <div className="text-xs text-slate-500">{e.phone}</div>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button className="px-4 py-2 rounded-full border hover:bg-slate-50" onClick={()=>setStep(1)}>Atrás</button>
                <button className="px-5 py-2 rounded-full bg-rose-500 text-white disabled:opacity-50 hover:bg-rose-600" disabled={!canStep2} onClick={()=>setStep(3)}>Continuar</button>
              </div>
            </section>
          )}

          {/* Paso 3: Calendario + slots (la lógica ya la tienes) */}
          {step === 3 && (
            <section className="bg-white rounded-xl border p-4 space-y-4">
              <h2 className="font-semibold">Selecciona fecha y hora</h2>
              <CalendarMonth
                employeeId={employeeId}
                serviceDuration={serviceDuration}
                selectedDate={date}
                onSelect={(d) => { setDate(d); setDateTimeISO(null); }}
              />

              <div>
                <h3 className="font-semibold mt-4 mb-2">Horarios disponibles</h3>
                {date ? (
                  <TimeSlots
                    employeeId={employeeId}
                    serviceId={serviceId}
                    date={date}
                    value={dateTimeISO}
                    onChange={(iso) => setDateTimeISO(iso)}
                    durationMinutes={serviceDuration}
                  />
                ) : (
                  <p className="text-sm text-slate-500">Elige un día para ver horarios.</p>
                )}
              </div>

              <div className="flex justify-between">
                <button className="px-4 py-2 rounded border" onClick={() => setStep(2)}>Atrás</button>
                <button
                  className="px-4 py-2 rounded bg-rose-500 text-white disabled:opacity-50"
                  disabled={!canStep3}
                  onClick={async () => {
                    // extra check con backend antes de avanzar
                    try {
                      setLoading(true);
                      const res = await api.post("/appointments/validate", { employeeId, serviceId, dateTime: dateTimeISO });
                      if (!res.data?.available) {
                        setError("Ese horario ya no está disponible. Elige otro.");
                        // actualizar disponibilidad en TimeSlots será manejado ahí
                        return;
                      }
                      setStep(4);
                    } catch (e) {
                      // si el backend falla, igual se permite avanzar con precaución
                      setStep(4);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Continuar
                </button>
              </div>
            </section>
          )}

          {/* Paso 4: Resumen */}
          {step === 4 && (
            <section className="bg-white rounded-xl border p-4 space-y-4">
              <h2 className="font-semibold">Resumen</h2>
              <div className="space-y-1 text-sm text-slate-700">
                <div>Servicio: <b>{selectedService?.name || "-"}</b></div>
                <div>Profesional: <b>{selectedEmployee?.name || "-"}</b></div>
                <div>
                  Fecha y hora:{" "}
                  <b>{dateTimeISO ? formatLocalDatetimeForDisplay(dateTimeISO) : "-"}</b>
                </div>
              </div>

              <ul className="divide-y">
                {cart.map((i) => (
                  <li key={i.id + i.type} className="py-2 flex justify-between text-sm">
                    <span className="text-slate-700">{i.name} <span className="text-slate-400">x{i.cantidad || 1}</span></span>
                    <span className="font-semibold text-rose-500">${((i.price||0) * (i.cantidad||1)).toLocaleString()}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl text-rose-600 font-extrabold">${total.toLocaleString()}</span>
              </div>

              {error && <div className="p-3 rounded bg-rose-50 text-rose-700 border border-rose-200">{error}</div>}

              <div className="flex justify-between pt-2">
                <button className="px-4 py-2 rounded border" onClick={() => setStep(3)}>Atrás</button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-6 py-2 rounded bg-rose-500 hover:bg-rose-600 text-white font-semibold disabled:opacity-50"
                >
                  {loading ? "Procesando..." : (user ? "Reservar y pagar" : "Iniciar sesión para continuar")}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: look mejorado */}
        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-2xl overflow-hidden sticky top-6">
            <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-rose-600" />
            <div className="p-4 space-y-2">
              <h3 className="font-semibold">Tu carrito</h3>
              {cart.map((i) => (
                <div key={i.id + i.type} className="flex justify-between text-sm">
                  <span className="text-slate-600">{i.name} x{i.cantidad || 1}</span>
                  <span className="font-medium">${((i.price||0) * (i.cantidad||1)).toLocaleString()}</span>
                </div>
              ))}
              <div className="h-px bg-slate-200 my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}