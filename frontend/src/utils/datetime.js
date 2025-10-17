// usa: npm install luxon
const { DateTime } = require("luxon");

/**
 * Convierte dateStr "YYYY-MM-DD" y timeStr "HH:MM" (hora local del usuario)
 * a ISO UTC (ej: "2025-10-17T14:30:00.000Z").
 * Uso: enviar la ISO resultante al backend.
 */
function toUTCISOStringFromLocal(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  // DateTime.fromISO con zone 'local' interpreta en la zona del cliente
  const dt = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: "local" });
  return dt.toUTC().toISO(); // ISO en UTC
}

/**
 * Formatea una ISO (UTC o con offset) para mostrar en UI en la zona local del usuario.
 * Ej: "Sábado, 17 Oct 2025 — 11:30 AM"
 */
function formatLocalDatetimeForDisplay(isoString, opts = {}) {
  if (!isoString) return "-";
  const dt = DateTime.fromISO(isoString, { zone: "utc" }).toLocal();
  return dt.toLocaleString(opts.format || DateTime.DATETIME_MED); // personalizable
}

/**
 * Devuelve el nombre de zona del usuario para mostrar en UI (ej: "America/Bogota").
 */
function getUserTimezoneName() {
  return DateTime.local().zoneName;
}

/**
 * Convierte una ISO local (ya provista) a DateTime local legible.
 */
function isoToLocalDateTime(iso) {
  if (!iso) return null;
  return DateTime.fromISO(iso, { zone: "utc" }).toLocal();
}

module.exports = {
  toUTCISOStringFromLocal,
  formatLocalDatetimeForDisplay,
  getUserTimezoneName,
  isoToLocalDateTime,
};