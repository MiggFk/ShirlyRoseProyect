import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserShield, 
  FaUserTie, 
  FaUsers, 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaUserCircle,
  FaSearch,
  FaBan,
  FaCheckCircle
} from 'react-icons/fa';
import { useUsers } from '../../hooks/useUsers';

const Users = () => {
  const { users, loading, createUser, updateUser, deleteUser, getUsersByRole, toggleUserStatus } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const groupedUsers = getUsersByRole();

  // Agregar esta función auxiliar al inicio del componente Users
  const normalizeText = (text) => {
    return text
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Modificar la función getFilteredUsers
  const getFilteredUsers = () => {
    let filtered = users;

    if (activeTab !== 'all') {
      filtered = filtered.filter(user => user.role === activeTab);
    }

    if (searchTerm) {
      const normalizedSearch = normalizeText(searchTerm);
      filtered = filtered.filter(user => 
        normalizeText(user.name).includes(normalizedSearch) ||
        normalizeText(user.email).includes(normalizedSearch)
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const handleCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const tabs = [
    { id: 'all', label: 'Todos', count: users.length },
    { id: 'admin', label: 'Administradores', count: groupedUsers.admin.length },
    { id: 'empleado', label: 'Empleados', count: groupedUsers.empleado.length },
    { id: 'cliente', label: 'Clientes', count: groupedUsers.cliente.length }
  ];

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-700',
      empleado: 'bg-blue-100 text-blue-700',
      cliente: 'bg-rose-100 text-rose-700'
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return FaUserShield;
      case 'empleado': return FaUserTie;
      case 'cliente': return FaUsers;
      default: return FaUserCircle;
    }
  };

  // 🔧 Función para formatear fecha correctamente
  const formatBirthDate = (birthDate) => {
    if (!birthDate) return '';
    
    try {
      // Si la fecha ya viene en formato YYYY-MM-DD, usarla directamente
      const dateStr = birthDate.split('T')[0];
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header - IGUAL QUE PRODUCTS */}
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-4xl font-bold text-white drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Gestión de Usuarios
        </motion.h2>

        <motion.button
          onClick={handleCreate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-white/20 transition-all font-semibold flex items-center gap-2"
        >
          <FaPlus size={18} />
          Nuevo Usuario
        </motion.button>
      </div>

      {/* Estadísticas - TRANSPARENTES COMO PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center">
              <FaUsers className="text-rose-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Total Usuarios</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <FaUserShield className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Administradores</p>
              <p className="text-2xl font-bold text-white">{groupedUsers.admin.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <FaUserTie className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Empleados</p>
              <p className="text-2xl font-bold text-white">{groupedUsers.empleado.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Clientes</p>
              <p className="text-2xl font-bold text-white">{groupedUsers.cliente.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filtros - TRANSPARENTES */}
      <motion.div 
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Tabla - TRANSPARENTE */}
      <motion.div
        className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-white text-lg">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-100">
              <thead className="bg-white/10 backdrop-blur-xl border-b border-white/10">
                <tr className="text-white">
                  <th className="py-3 px-4">USUARIO</th>
                  <th className="py-3 px-4 hidden md:table-cell">CONTACTO</th>
                  <th className="py-3 px-4">ROL</th>
                  <th className="py-3 px-4">ESTADO</th>
                  <th className="py-3 px-4 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {user.profileImage?.url ? (
                              <img
                                src={user.profileImage.url}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center border border-white/20">
                                <RoleIcon className="text-gray-300" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-100">{user.name}</p>
                              {user.birthDate && (
                                <p className="text-xs text-gray-300 flex items-center gap-1">
                                  <FaBirthdayCake />
                                  {formatBirthDate(user.birthDate)}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-200 flex items-center gap-1">
                              <FaEnvelope className="text-gray-400" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-sm text-gray-300 flex items-center gap-1">
                                <FaPhone className="text-gray-400" />
                                {user.phone}
                              </p>
                            )}
                            {user.address?.city && (
                              <p className="text-sm text-gray-300 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-gray-400" />
                                {user.address.city}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {user.isActive ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1 w-fit">
                              <FaCheckCircle />
                              Activo
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1 w-fit">
                              <FaBan />
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <motion.button
                              onClick={() => handleEdit(user)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-white hover:text-rose-300 rounded-lg transition-all"
                              title="Editar"
                            >
                              <FaEdit size={16} />
                            </motion.button>
                            <motion.button
                              onClick={() => toggleUserStatus(user._id, user.isActive)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-2 rounded-lg transition-all ${
                                user.isActive 
                                  ? 'text-white hover:text-orange-300' 
                                  : 'text-white hover:text-green-300'
                              }`}
                              title={user.isActive ? 'Desactivar' : 'Activar'}
                            >
                              {user.isActive ? <FaBan size={16} /> : <FaCheckCircle size={16} />}
                            </motion.button>
                            <motion.button
                              onClick={() => deleteUser(user._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-red-400 hover:text-red-300 rounded-lg transition-all"
                              title="Eliminar"
                            >
                              <FaTrash size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        user={selectedUser}
        onCreate={createUser}
        onUpdate={updateUser}
      />
    </motion.div>
  );
};

// Modal Component
const UserModal = ({ isOpen, onClose, mode, user, onCreate, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cliente',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    birthDate: '',
    isActive: true
  });

  React.useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'cliente',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'cliente',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        birthDate: '',
        isActive: true
      });
    }
  }, [user, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode
      },
      birthDate: formData.birthDate || null,
      isActive: formData.isActive
    };

    if (mode === 'create' || formData.password) {
      userData.password = formData.password;
    }

    try {
      if (mode === 'create') {
        await onCreate(userData);
      } else {
        await onUpdate(user._id, userData);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            {mode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Estado (solo en edición) */}
          {mode === 'edit' && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/20">
              <span className="text-sm font-medium text-white">
                Estado: {formData.isActive ? 'Activo' : 'Inactivo'}
              </span>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-rose-500 focus:ring-rose-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">Activar usuario</span>
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña {mode === 'create' ? '*' : '(opcional)'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={mode === 'create'}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rol *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              >
                <option className="text-black" value="cliente">Cliente</option>
                <option className="text-black" value="empleado">Empleado</option>
                <option className="text-black" value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Calle</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ciudad</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Código Postal</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-rose-500 border-white/20 text-white rounded-lg hover:bg-rose-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition"
            >
              {mode === 'create' ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Users;