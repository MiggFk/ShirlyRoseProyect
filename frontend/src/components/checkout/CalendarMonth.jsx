import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "../../api/axios";
import { SCHEDULING } from "../../config/scheduling";

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function pad(n) { return String(n).padStart(2, "0"); }
function toDateStr(y, m, d) { return `${y}-${pad(m+1)}-${pad(d)}`; }

export default function CalendarMonth({ employeeId, serviceDuration = 30, selectedDate, onSelect }) {
  const baseDate = selectedDate ? new Date(selectedDate) : new Date();
  const [viewYear, setViewYear] = useState(baseDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(baseDate.getMonth());
  const [freeByDay, setFreeByDay] = useState({});
  const [loading, setLoading] = useState(false);

  const totalDays = useMemo(() => daysInMonth(viewYear, viewMonth), [viewYear, viewMonth]);
  const firstDay = useMemo(() => new Date(viewYear, viewMonth, 1).getDay(), [viewYear, viewMonth]);

  const loadAvailability = useCallback(async () => {
    if (!employeeId) { setFreeByDay({}); return; }
    setLoading(true);
    try {
      const res = await api.get("/appointments/month-availability", {
        params: {
          employeeId,
          year: viewYear,
          month: viewMonth + 1,
          durationMinutes: serviceDuration,
          slotMinutes: SCHEDULING.slotMinutes,
          openHour: SCHEDULING.openHour,
          closeHour: SCHEDULING.closeHour,
        }
      });
      setFreeByDay(res.data?.days || {});
    } catch (e) {
      console.error("month-availability:", e);
      setFreeByDay({});
    } finally {
      setLoading(false);
    }
  }, [employeeId, viewYear, viewMonth, serviceDuration]);

  useEffect(() => { loadAvailability(); }, [loadAvailability]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "appointments_changed") {
        loadAvailability();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [loadAvailability]);

  const weeks = useMemo(() => {
    const cells = [];
    const offset = (firstDay + 6) % 7;
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const chunks = [];
    for (let i = 0; i < cells.length; i += 7) chunks.push(cells.slice(i, i + 7));
    return chunks;
  }, [firstDay, totalDays]);

  const changeMonth = (delta) => {
    const newDate = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(newDate.getFullYear());
    setViewMonth(newDate.getMonth());
  };

  const dateTodayStr = new Date().toISOString().slice(0,10);
  const selectedStr = selectedDate || "";

  return (
    <div className="border rounded-2xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <button onClick={()=>setViewMonth(m => m-1 < 0 ? (setViewYear(y=>y-1), 11) : m-1)} className="text-sm px-3 py-1.5 border rounded-full hover:bg-rose-50">←</button>
        <div className="font-semibold capitalize">
          {new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button onClick={()=>setViewMonth(m => m+1 > 11 ? (setViewYear(y=>y+1), 0) : m+1)} className="text-sm px-3 py-1.5 border rounded-full hover:bg-rose-50">→</button>
      </div>

      <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">
        {["L", "M", "X", "J", "V", "S", "D"].map(d => <div key={d} className="text-center py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.map((w, wi) => (
          <React.Fragment key={wi}>
            {w.map((d, di) => {
              if (!d) return <div key={di} className="h-20 bg-slate-50 rounded" />;
              const dateStr = toDateStr(viewYear, viewMonth, d);
              const free = freeByDay[dateStr] ?? 0;
              const disabled = dateStr < dateTodayStr || !employeeId;
              const selected = dateStr === selectedStr;
              return (
                <button
                  key={di}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(dateStr)}
                  className={[
                    "h-20 rounded-xl border flex flex-col items-center justify-center text-sm transition relative",
                    disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" :
                    selected ? "bg-rose-500 text-white border-rose-500 shadow" :
                    "bg-white hover:bg-rose-50 border-slate-200"
                  ].join(" ")}
                  title={disabled ? "No disponible" : (free ? `${free} horarios disponibles` : "Sin horarios")}
                >
                  <div className="text-base font-semibold">{d}</div>
                  <div className={[
                    "text-xs mt-1 px-2 py-0.5 rounded-full",
                    disabled ? "bg-slate-100 text-slate-400" :
                    free > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    "bg-rose-50 text-rose-700 border border-rose-200"
                  ].join(" ")}>
                    {loading ? "Cargando..." : (free > 0 ? `${free} libres` : "Sin horarios")}
                  </div>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}