const MAP = {
  pendiente: "pending", pending: "pending",
  confirmada: "confirmed", confirmado: "confirmed", confirmed: "confirmed",
  completada: "completed", completed: "completed", finalizada: "completed", finalizado: "completed",
  cancelada: "cancelled", cancelado: "cancelled", cancelled: "cancelled",
  "no show": "no_show", noshow: "no_show", "no-show": "no_show", ausente: "no_show",
  reprogramada: "rescheduled", reagendada: "rescheduled", reprogramado: "rescheduled", rescheduled: "rescheduled",
  "en progreso": "in_progress", "en-progreso": "in_progress", inprogress: "in_progress", in_progress: "in_progress",
};

export function normalizeStatus(s) {
  if (!s) return "pending";
  const k = String(s).toLowerCase().trim();
  return MAP[k] || k;
}

export function statusMeta(key) {
  const k = normalizeStatus(key);
  const meta = {
    pending:   { label: "Pendiente",   badge: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Confirmada",  badge: "bg-emerald-100 text-emerald-700" },
    completed: { label: "Completada",  badge: "bg-slate-100 text-slate-700" },
    cancelled: { label: "Cancelada",   badge: "bg-rose-100 text-rose-700" },
    no_show:   { label: "No asistió",  badge: "bg-orange-100 text-orange-700" },
    rescheduled:{label: "Reprogramada",badge: "bg-indigo-100 text-indigo-700" },
    in_progress:{label: "En progreso", badge: "bg-blue-100 text-blue-700" },
  };
  return meta[k] || { label: k, badge: "bg-slate-100 text-slate-700" };
}

export function parseAppointmentDate(apt) {
  if (!apt) return null;
  if (apt.dateTime) return new Date(apt.dateTime);
  if (apt.date && apt.time) return new Date(`${apt.date}T${apt.time}`);
  if (apt.date) return new Date(apt.date);
  if (apt.raw?.dateTime) return new Date(apt.raw.dateTime);
  return null;
}

export function isPast(dt) {
  if (!dt) return false;
  const t = new Date(); t.setHours(0,0,0,0);
  return dt < t;
}

export function isFuture(dt) {
  if (!dt) return false;
  const t = new Date(); t.setHours(0,0,0,0);
  return dt >= t;
}