import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";
import { useUsers } from '../../hooks/useUsers';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';

export default function Users() {
  const { users, loading, createUser, editUser, deleteUser } = useUsers();

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Nuevo Usuario",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Nombre completo" required />
        <input id="swal-input-email" class="swal2-input" placeholder="Email" type="email" required />
        <input id="swal-input-password" type="password" class="swal2-input" placeholder="Contraseña" required />
        <select id="swal-input-role" class="swal2-input">
          <option value="admin">Admin</option>
          <option value="empleado">Empleado</option>
          <option value="cliente">Cliente</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const name = document.getElementById("swal-input-name").value;
        const email = document.getElementById("swal-input-email").value;
        const password = document.getElementById("swal-input-password").value;
        const role = document.getElementById("swal-input-role").value;
        
        if (!name || !email || !password || !role) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return { name, email, password, role };
      },
    });

    if (formValues) {
      createUser(formValues);
    }
  };

  const handleEdit = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar usuario",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Nombre" value="${user.name}" required />
        <input id="swal-input-email" class="swal2-input" placeholder="Email" value="${user.email}" type="email" required />
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
        const name = document.getElementById("swal-input-name").value;
        const email = document.getElementById("swal-input-email").value;
        const role = document.getElementById("swal-input-role").value;

        if (!name || !email || !role) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }
        return { name, email, role };
      },
    });

    if (formValues) {
      editUser(user._id, formValues);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      deleteUser(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-pink-600">Gestión de Usuarios</h2>
        <button
          onClick={handleCreate}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 transition flex items-center gap-2"
        >
          <UserPlus size={20} />
          Crear Nuevo Usuario
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-pink-400 to-pink-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Rol</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.length > 0 ? (
                  users.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className={`border-b ${i % 2 === 0 ? "bg-pink-50" : "bg-white"}`}
                    >
                      <td className="py-2 px-6 font-medium">{u.name}</td>
                      <td className="py-2 px-6 text-gray-600">{u.email}</td>
                      <td className="py-2 px-6">{u.role}</td>
                      <td className="py-2 px-6 text-center space-x-3">
                        <button
                          onClick={() => handleEdit(u)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-full shadow-sm hover:bg-yellow-600 transition"
                          aria-label="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full shadow-sm hover:bg-red-600 transition"
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500 text-lg">
                      No hay usuarios registrados
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}