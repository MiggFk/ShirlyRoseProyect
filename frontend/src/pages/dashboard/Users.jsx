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
      cancelButtonColor: "#858585ff",
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
      {/* Título y botón */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-rose-300 drop-shadow-md">
          Gestión de Usuarios
        </h2>
        <motion.button
          onClick={handleCreate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg flex items-center gap-2 
                     bg-white/10 backdrop-blur-xl border border-white/30 
                     text-rose-300 hover:bg-white/20 hover:text-rose-200 
                     transition shadow-lg"
        >
          <UserPlus size={20} />
          Crear Nuevo Usuario
        </motion.button>
      </div>

      {/* Tabla glass */}
      <motion.div
        className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/30 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <table className="min-w-full text-sm text-left text-gray-100 rounded-3xl overflow-hidden">
          <thead className="bg-white/10 backdrop-blur-xl border-b border-white/10 rounded-t-3xl">
            <tr className="text-rose-300">
              <th className="py-3 px-4 font-semibold">Nombre</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Rol</th>
              <th className="py-3 px-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="rounded-b-3xl overflow-hidden">
            <AnimatePresence>
              {users.length > 0 ? (
                users.map((u) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-white/10 
                               bg-white/10 backdrop-blur-xl 
                               hover:bg-white/20 transition-all last:rounded-b-3xl"
                  >
                    <td className="py-3 px-4 font-medium text-gray-100">{u.name}</td>
                    <td className="py-3 px-4 text-gray-200">{u.email}</td>
                    <td className="py-3 px-4 text-gray-100">{u.role}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <motion.button
                        onClick={() => handleEdit(u)}
                        whileHover={{ scale: 1.1 }}
                        className="inline-flex items-center justify-center w-9 h-9 text-white transition"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(u._id)}
                        whileHover={{ scale: 1.1 }}
                        className="inline-flex items-center justify-center w-9 h-9 text-red-400 hover:text-red-400 transition"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-300 text-lg">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
