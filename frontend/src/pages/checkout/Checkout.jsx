import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CalendarMonth from "../../components/checkout/CalendarMonth";
import TimeSlots from "../../components/checkout/TimeSlots";

const Step = ({ n, current, label }) => (
  <div className="flex items-center gap-2">
    <div className={[
      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
      current === n ? "bg-rose-500 text-white" : current > n ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
    ].join(" ")}>{n}</div>
    <span className="text-sm">{label}</span>
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    notes: "",
  });
  const [employeeId, setEmployeeId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [dateTimeISO, setDateTimeISO] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const canStep1 = useMemo(() => !!(customer.name && customer.email), [customer]);
  const canStep2 = useMemo(() => !!(employeeId && serviceId), [employeeId, serviceId]);
  const canStep3 = useMemo(() => !!(date && dateTimeISO), [date, dateTimeISO]);

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, srvRes] = await Promise.all([
          api.get("/employees"),
          api.get("/services"),
        ]);
        setEmployees(empRes.data?.employees || empRes.data || []);
        setServices(srvRes.data?.services || srvRes.data || []);
      } catch (e) {
        console.error("Cargando catálogos:", e);
      }
    };
    load();
  }, []);

  // Prefill desde carrito: busca el primer servicio
  useEffect(() => {
    const srvItem = cart?.find(i => i.type === "servicio" || i.kind === "servicio" || i.kind === "service");
    if (srvItem && !serviceId) {
      setServiceId(srvItem._id || srvItem.id);
    }
    if (srvItem?.employeeId && !employeeId) {
      setEmployeeId(srvItem.employeeId);
    }
    if (srvItem?.dateTime && !dateTimeISO) {
      const iso = new Date(srvItem.dateTime).toISOString();
      setDate(iso.slice(0,10));
      setDateTimeISO(iso);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  useEffect(() => {
    const emp = employees.find(e => e._id === employeeId) || null;
    setSelectedEmployee(emp);
  }, [employeeId, employees]);

  useEffect(() => {
    const srv = services.find(s => (s._id || s.id) === serviceId) || null;
    setSelectedService(srv);
  }, [serviceId, services]);

  const serviceDuration = useMemo(() => selectedService?.durationMinutes || selectedService?.duration || 30, [selectedService]);

  useEffect(() => {
    if (customer.name && customer.email && employeeId && serviceId && date && dateTimeISO) {
      setStep(4);
    } else if (customer.name && customer.email && employeeId && serviceId) {
      setStep((prev) => Math.max(prev, 3));
    } else if (customer.name && customer.email) {
      setStep((prev) => Math.max(prev, 2));
    }
  }, [customer, employeeId, serviceId, date, dateTimeISO]);

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/payments/checkout", {
        cart,
        appointment: { employeeId, serviceId, dateTime: dateTimeISO },
        customer,
        userId: user?._id || null,
      });
      clearCart();
      navigate(`/pay/${res.data.intentId}`);
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo iniciar el checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Finalizar reserva</h1>

      <div className="flex items-center justify-between bg-white p-4 rounded-xl border mb-6">
        <Step n={1} current={step} label="Tus datos" />
        <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
        <Step n={2} current={step} label="Servicio y profesional" />
        <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
        <Step n={3} current={step} label="Fecha y hora" />
        <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
        <Step n={4} current={step} label="Resumen y pago" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <section className="bg-white rounded-xl border p-4 space-y-4">
              <h2 className="font-semibold">Tus datos</h2>
              {!user && <p className="text-sm text-slate-500">Puedes reservar como invitado.</p>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className="border p-2 rounded" placeholder="Nombre" value={customer.name} onChange={(e)=>setCustomer({...customer, name:e.target.value})}/>
                <input className="border p-2 rounded" placeholder="Email" value={customer.email} onChange={(e)=>setCustomer({...customer, email:e.target.value})}/>
                <input className="border p-2 rounded" placeholder="Teléfono" value={customer.phone} onChange={(e)=>setCustomer({...customer, phone:e.target.value})}/>
              </div>
              <textarea className="border p-2 rounded w-full" rows={3} placeholder="Notas o preferencias (opcional)" value={customer.notes} onChange={(e)=>setCustomer({...customer, notes:e.target.value})}/>
              <div className="flex justify-end">
                <button className="px-4 py-2 rounded bg-rose-500 text-white disabled:opacity-50" disabled={!canStep1} onClick={()=>setStep(2)}>Continuar</button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="bg-white rounded-xl border p-4 space-y-6">
              <h2 className="font-semibold">Elige tu servicio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map(s => {
                  const selected = (s._id || s.id) === serviceId;
                  return (
                    <button
                      key={s._id || s.id}
                      type="button"
                      onClick={()=>setServiceId(s._id || s.id)}
                      className={[
                        "text-left p-4 rounded-xl border transition",
                        selected ? "border-rose-500 bg-rose-50 shadow" : "border-slate-200 hover:border-rose-300 hover:bg-rose-50/40"
                      ].join(" ")}
                    >
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm text-slate-600">
                        {s.durationMinutes || s.duration ? `${s.durationMinutes || s.duration} min` : "Duración variable"}
                        {s.price ? ` • $${s.price.toLocaleString?.() || s.price}` : ""}
                      </div>
                      {selected && <div className="text-xs mt-1 text-rose-600">Seleccionado</div>}
                    </button>
                  );
                })}
              </div>

              <h2 className="font-semibold">Elige profesional</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employees.map(e => {
                  const selected = e._id === employeeId;
                  return (
                    <button
                      key={e._id}
                      type="button"
                      onClick={()=>setEmployeeId(e._id)}
                      className={[
                        "p-4 rounded-xl border flex items-center gap-3 transition",
                        selected ? "border-rose-500 bg-rose-50 shadow" : "border-slate-200 hover:border-rose-300 hover:bg-rose-50/40"
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
                <button className="px-4 py-2 rounded border" onClick={()=>setStep(1)}>Atrás</button>
                <button className="px-4 py-2 rounded bg-rose-500 text-white disabled:opacity-50" disabled={!canStep2} onClick={()=>setStep(3)}>Continuar</button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="bg-white rounded-xl border p-4 space-y-4">
              <h2 className="font-semibold">Selecciona fecha y hora</h2>
              <CalendarMonth
                employeeId={employeeId}
                serviceDuration={serviceDuration}
                selectedDate={date}
                onSelect={(d)=>{ setDate(d); setDateTimeISO(null); }}
              />
              <div>
                <h3 className="font-semibold mt-4 mb-2">Horarios disponibles</h3>
                {date ? (
                  <TimeSlots
                    employeeId={employeeId}
                    serviceId={serviceId}
                    date={date}
                    value={dateTimeISO}
                    onChange={setDateTimeISO}
                    durationMinutes={serviceDuration}
                  />
                ) : (
                  <p className="text-sm text-slate-500">Elige un día para ver horarios.</p>
                )}
              </div>
              <div className="flex justify-between">
                <button className="px-4 py-2 rounded border" onClick={()=>setStep(2)}>Atrás</button>
                <button
                  className="px-4 py-2 rounded bg-rose-500 text-white disabled:opacity-50"
                  disabled={!canStep3}
                  onClick={async ()=>{
                    try {
                      const res = await api.post("/appointments/validate", {
                        employeeId, serviceId, dateTime: dateTimeISO,
                      });
                      if (!res.data?.available) return alert("Ese horario ya no está disponible.");
                      setStep(4);
                    } catch {
                      setStep(4);
                    }
                  }}
                >
                  Continuar
                </button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="bg-white rounded-xl border p-4 space-y-4">
              <h2 className="font-semibold">Resumen</h2>
              <div className="space-y-1 text-sm text-slate-700">
                <div>Servicio: <b>{selectedService?.name}</b></div>
                <div>Profesional: <b>{selectedEmployee?.name}</b></div>
                <div>Fecha y hora: <b>{dateTimeISO ? new Date(dateTimeISO).toLocaleString() : "-"}</b></div>
              </div>
              <ul className="divide-y">
                {cart.map((i) => (
                  <li key={i.id + i.type} className="py-2 flex justify-between text-sm">
                    <span>{i.name} x{i.cantidad || 1}</span>
                    <span>${((i.price||0) * (i.cantidad||1)).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>

              {error && <div className="p-3 rounded bg-rose-50 text-rose-700 border border-rose-200">{error}</div>}

              <div className="flex justify-between">
                <button className="px-4 py-2 rounded border" onClick={()=>setStep(3)}>Atrás</button>
                <button onClick={handleConfirm} disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">
                  {loading ? "Procesando..." : "Reservar y pagar (simulado)"}
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-xl p-4 sticky top-6 space-y-2">
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
            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-3 px-4 py-2 rounded bg-rose-500 text-white"
            >
              Continuar reserva
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}