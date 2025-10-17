import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { SCHEDULING } from "../../config/scheduling";

function toISO(dateStr, timeStr) { return new Date(`${dateStr}T${timeStr}:00`).toISOString(); }
function toDate(dateStr, timeStr) { return new Date(`${dateStr}T${timeStr}:00`); }
function addMinutes(date, mins) { return new Date(date.getTime() + mins * 60000); }

function generateSlots(dateStr, { openHour, closeHour, slotMinutes }) {
  if (!dateStr) return [];
  const slots = [];
  const start = new Date(`${dateStr}T${String(openHour).padStart(2, "0")}:00:00`);
  const end = new Date(`${dateStr}T${String(closeHour).padStart(2, "0")}:00:00`);
  for (let d = new Date(start); d < end; d = new Date(d.getTime() + slotMinutes * 60000)) {
    slots.push(d.toTimeString().slice(0, 5));
  }
  return slots;
}
function overlaps(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }

export default function TimeSlots({ employeeId, serviceId, date, value, onChange, durationMinutes = 30 }) {
  const [busyIntervals, setBusyIntervals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const slots = useMemo(() => generateSlots(date, SCHEDULING), [date]);

  useEffect(() => {
    const fetchBusy = async () => {
      setNotice("");
      if (!employeeId || !date) { setBusyIntervals([]); return; }
      setLoading(true);
      try {
        const res = await api.get("/appointments/availability", { params: { employeeId, date } });
        const intervals = (res.data?.busyIntervals || []).map(iv => ({
          start: new Date(iv.start), end: new Date(iv.end),
        }));
        setBusyIntervals(intervals);
      } catch {
        setNotice("No se pudo cargar la disponibilidad.");
        setBusyIntervals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusy();
  }, [employeeId, date]);

  const isBlocked = (t) => {
    if (!date) return true;
    const start = toDate(date, t);
    const end = addMinutes(start, durationMinutes);

    const close = new Date(`${date}T${String(SCHEDULING.closeHour).padStart(2,"0")}:00:00`);
    if (end > close) return true;

    const now = new Date();
    const today = now.toISOString().slice(0,10) === date;
    if (today && start <= now) return true;

    return busyIntervals.some(iv => overlaps(start, end, iv.start, iv.end));
  };

  const freeSlots = useMemo(() => slots.filter(t => !isBlocked(t)), [slots, busyIntervals, date, durationMinutes]);

  const onPick = async (t) => {
    const iso = toISO(date, t);
    try {
      const res = await api.post("/appointments/validate", { employeeId, serviceId, dateTime: iso });
      if (!res.data?.available) {
        setNotice("Ese horario acaba de ocuparse. Elige otro.");
        const r = await api.get("/appointments/availability", { params: { employeeId, date } });
        const intervals = (r.data?.busyIntervals || []).map(iv => ({ start: new Date(iv.start), end: new Date(iv.end) }));
        setBusyIntervals(intervals);
        return;
      }
    } catch { /* fallback local */ }
    onChange(iso);
  };

  if (!date || !employeeId) {
    return <p className="text-sm text-slate-500">Selecciona profesional y fecha.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Horario: {SCHEDULING.openHour}:00 – {SCHEDULING.closeHour}:00</span>
        <span className={freeSlots.length ? "text-emerald-600" : "text-rose-600"}>
          {freeSlots.length ? `${freeSlots.length} horarios disponibles` : "Sin horarios disponibles"}
        </span>
      </div>
      {loading && <p className="text-sm text-slate-500">Cargando disponibilidad...</p>}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {slots.map((t) => {
          const disabled = isBlocked(t);
          const selected = value?.slice(11,16) === t;
          return (
            <button
              key={t}
              type="button"
              disabled={disabled}
              onClick={() => onPick(t)}
              className={[
                "px-3 py-2 rounded border text-sm transition",
                disabled
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                  : selected
                  ? "bg-rose-500 text-white border-rose-500 shadow"
                  : "bg-white hover:bg-rose-50 border-slate-200"
              ].join(" ")}
              title={disabled ? "No disponible" : "Disponible"}
            >
              {t}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-500">Duración del servicio: {durationMinutes} min</p>
      {notice && <p className="text-xs text-rose-600">{notice}</p>}
    </div>
  );
}