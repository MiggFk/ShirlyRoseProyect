import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "../../api/axios";
import { SCHEDULING } from "../../config/scheduling";
import { toUTCISOStringFromLocal } from "../../utils/datetime";

function toDate(dateStr, timeStr) { return new Date(`${dateStr}T${timeStr}:00`); }
function addMinutes(date, mins) { return new Date(date.getTime() + mins * 60000); }
function overlaps(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }

export default function TimeSlots({ employeeId, serviceId, date, value, onChange, durationMinutes = 30 }) {
  const [busyIntervals, setBusyIntervals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const slots = useMemo(() => {
    if (!date) return [];
    const start = new Date(`${date}T${String(SCHEDULING.openHour).padStart(2,"0")}:00:00`);
    const end = new Date(`${date}T${String(SCHEDULING.closeHour).padStart(2,"0")}:00:00`);
    const arr = [];
    for (let d = new Date(start); d < end; d = new Date(d.getTime() + SCHEDULING.slotMinutes * 60000)) {
      arr.push(d.toTimeString().slice(0,5));
    }
    return arr;
  }, [date]);

  const fetchBusy = useCallback(async () => {
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
  }, [employeeId, date]);

  useEffect(() => { fetchBusy(); }, [fetchBusy]);

  useEffect(() => {
    const onStorage = (e) => { if (e.key === "appointments_changed") fetchBusy(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchBusy]);

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

  const onPick = async (t) => {
    const isoUTC = toUTCISOStringFromLocal(date, t);
    if (!isoUTC) return;
    try {
      const res = await api.post("/appointments/validate", { employeeId, serviceId, dateTime: isoUTC });
      if (!res.data?.available) {
        setNotice("Ese horario acaba de ocuparse. Elige otro.");
        await fetchBusy();
        return;
      }
    } catch { /* fallback */ }
    onChange(isoUTC);
  };

  if (!date || !employeeId) return <p className="text-sm text-slate-500">Selecciona profesional y fecha.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Horario: {SCHEDULING.openHour}:00 – {SCHEDULING.closeHour}:00</span>
        <span className={slots.filter(t => !isBlocked(t)).length ? "text-emerald-600" : "text-rose-600"}>
          {slots.filter(t => !isBlocked(t)).length ? `${slots.filter(t => !isBlocked(t)).length} horarios disponibles` : "Sin horarios disponibles"}
        </span>
      </div>
      {loading && <div className="h-10 rounded-xl border bg-slate-50 animate-pulse" />}

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
                "px-3 py-2 rounded-full border text-sm transition",
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

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-white border border-slate-200 inline-block" /> Libre
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200 inline-block" /> Ocupado
        </span>
        <span className="ml-auto">Duración: {durationMinutes} min</span>
      </div>

      {notice && (
        <div className="text-xs p-2 rounded border bg-rose-50 text-rose-700 border-rose-200">
          {notice}
        </div>
      )}
    </div>
  );
}