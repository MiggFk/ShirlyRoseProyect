import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

// Helpers
const normalizeStatus = (s) => {
  const v = String(s || "").toLowerCase();
  if (["cancelada", "cancelado", "cancelled"].includes(v)) return "cancelled";
  if (["completada", "completed", "finalizada", "finalizado"].includes(v)) return "completed";
  if (["confirmada", "confirmado", "confirmed"].includes(v)) return "confirmed";
  if (["pendiente", "pending"].includes(v)) return "pending";
  return v || "pending";
};

const pickDateTime = (apt) => {
  if (apt?.dateTime) return new Date(apt.dateTime);
  if (apt?.date && apt?.time) return new Date(`${apt.date}T${apt.time}`);
  if (apt?.date) return new Date(apt.date);
  return null;
};

const normalizeAppointment = (apt) => {
  const dt = pickDateTime(apt);
  const service = apt.serviceId || apt.service || {};
  const employee = apt.employeeId || apt.employee || {};
  return {
    _id: apt._id,
    status: normalizeStatus(apt.status),
    dateTime: dt ? dt.toISOString() : null,
    service: {
      name: service.name,
      price: service.price ?? null,
      duration: service.durationMinutes ?? service.duration ?? null,
      category: service.category ?? apt.category ?? null,
    },
    employee: {
      name: employee.name,
      profileImage: employee.profileImage,
    },
    raw: apt,
  };
};

async function tryGetUser() {
  const endpoints = ["/users/me", "/auth/me", "/profile/me"];
  for (const ep of endpoints) {
    try {
      const { data } = await api.get(ep);
      if (data) return data.user || data.data || data;
    } catch {}
  }
  return null;
}

async function tryGetAppointments(userId) {
  const endpoints = [
    { url: "/appointments/mine", params: {} },
    { url: "/appointments/me", params: {} },
    { url: "/appointments", params: { me: true } },
    { url: "/appointments", params: { userId } },
  ];
  for (const ep of endpoints) {
    try {
      const { data } = await api.get(ep.url, { params: ep.params });
      const list = Array.isArray(data) ? data : (data.appointments || data.data || []);
      if (Array.isArray(list)) return list;
    } catch {}
  }
  return [];
}

export function useProfile() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const me = await tryGetUser();
      setUser(me);
      const list = await tryGetAppointments(me?._id);
      setAppointments(list.map(normalizeAppointment));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // 🔹 Actualizar perfil con FormData para enviar archivos
  const updateProfile = useCallback(async (profileData, imageFile) => {
    try {
      let payload = profileData;
      let config = {};
      if (imageFile) {
        const fd = new FormData();
        Object.entries(profileData || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.append(k, typeof v === "object" ? JSON.stringify(v) : v);
        });
        fd.append("profileImage", imageFile);
        payload = fd;
        config.headers = { "Content-Type": "multipart/form-data" };
      }
      // intenta varias rutas de perfil
      const endpoints = ["/users/me", "/profile/me", "/users/profile"];
      for (const ep of endpoints) {
        try {
          const { data } = await api.put(ep, payload, config);
          setUser(data.user || data.data || data);
          return true;
        } catch {}
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Eliminar imagen de perfil
  const deleteProfileImage = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await api.delete("/users/profile/image", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar usuario local
      const updatedUser = { ...user, profileImage: null };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      Swal.fire({
        icon: "success",
        title: "Imagen eliminada",
        text: "Tu foto de perfil ha sido eliminada.",
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la imagen. Intenta nuevamente.",
      });
      return false;
    }
  };

  // Cerrar sesión
  const handleLogout = useCallback(async () => {
    try { await api.post("/auth/logout"); } catch {}
    try { localStorage.removeItem("token"); } catch {}
    window.location.href = "/login";
  }, []);

  return { user, appointments, loading, handleLogout, updateProfile, deleteProfileImage, reload: load };
}