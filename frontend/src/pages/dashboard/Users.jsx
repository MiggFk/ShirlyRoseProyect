import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Editar usuario
  const handleEdit = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar usuario",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Nombre" value="${user.name}" />
        <input id="swal-input-email" class="swal2-input" placeholder="Email" value="${user.email}" />
        <select id="swal-input-role" class="swal2-input">
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
          <option value="empleado" ${user.role === "empleado" ? "selected" : ""}>Empleado</option>
          <option value="cliente" ${user.role === "cliente" ? "selected" : ""}>Cliente</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return {
          name: document.getElementById("swal-input-name").value,
          email: document.getElementById("swal-input-email").value,
          role: document.getElementById("swal-input-role").value,
        };
      },
    });

    if (formValues) {
      try {
        const token = localStorage.getItem("token");
        const res = await api.put(`/users/${user._id}`, formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(
          users.map((u) => (u._id === user._id ? res.data.user : u))
        );

        Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
      } catch (err) {
        console.error("Error al actualizar usuario:", err);
        Swal.fire("Error", "No se pudo actualizar el usuario", "error");
      }
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      Swal.fire("Error", "No se pudo eliminar el usuario", "error");
    }
  };

  if (loading) return <p className="p-6">Cargando usuarios...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Nombre</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Rol</th>
              <th className="border px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{u.name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.role}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
