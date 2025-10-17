import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";
import { 
  Edit, 
  Plus, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  AlertTriangle 
} from "lucide-react";

export default function Products() {
  const { 
    products, 
    loading, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    reactivateProduct, 
    permanentDeleteProduct 
  } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-4xl font-bold text-white drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Gestión de Productos
        </motion.h2>

        <motion.button
          onClick={handleCreate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-white/20 transition-all font-semibold flex items-center gap-2"
        >
          <Plus size={18} />
          Agregar Producto
        </motion.button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Eye className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Productos Activos</p>
              <p className="text-2xl font-bold text-white">
                {products.filter(p => p.isActive).length}
              </p>
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
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <EyeOff className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Productos Inactivos</p>
              <p className="text-2xl font-bold text-white">
                {products.filter(p => !p.isActive).length}
              </p>
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
              <ImageIcon className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Total Productos</p>
              <p className="text-2xl font-bold text-white">
                {products.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabla */}
      <motion.div
        className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-100">
            <thead className="bg-white/10 backdrop-blur-xl border-b border-white/10">
              <tr className="text-white">
                <th className="py-3 px-4">IMAGEN</th>
                <th className="py-3 px-4">PRODUCTO</th>
                <th className="py-3 px-4 hidden md:table-cell">DESCRIPCION</th>
                <th className="py-3 px-4">PRECIO</th>
                <th className="py-3 px-4 hidden sm:table-cell">STOCK</th>
                <th className="py-3 px-4">ESTADO</th>
                <th className="py-3 px-4 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {products.length > 0 ? (
                  products.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className={`border-b border-white/10 transition-all ${
                        product.isActive 
                          ? 'bg-white/5 hover:bg-white/10' 
                          : 'bg-red-500/10 hover:bg-red-500/20'
                      }`}
                    >
                      <td className="py-3 px-4">
                        {product.images && product.images.length > 0 ? (
                          <div className="relative group">
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className={`w-12 h-12 object-cover rounded-lg border border-white/20 ${
                                !product.isActive ? 'opacity-50 grayscale' : ''
                              }`}
                            />
                            {product.images.length > 1 && (
                              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                +{product.images.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center border border-white/20">
                            <ImageIcon size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-medium max-w-[150px] truncate ${
                          product.isActive ? 'text-gray-100' : 'text-gray-400'
                        }`}>
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-300 capitalize">
                          {product.category?.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-200 hidden md:table-cell">
                        <div className="max-w-xs truncate">
                          {product.description || 'Sin descripción'}
                        </div>
                      </td>
                      <td className={`py-3 px-4 font-semibold ${
                        product.isActive ? 'text-gray-100' : 'text-gray-400'
                      }`}>
                        ${product.price?.toLocaleString() || '0'}
                      </td>
                      <td className={`py-3 px-4 hidden sm:table-cell ${
                        product.isActive ? 'text-gray-100' : 'text-gray-400'
                      }`}>
                        <span className={`${
                          product.stock <= 5 && product.isActive 
                            ? 'text-orange-300' 
                            : product.isActive 
                              ? 'text-gray-100' 
                              : 'text-gray-400'
                        }`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {product.isActive ? (
                            <>
                              <Eye size={14} className="text-green-400" />
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                Activo
                              </span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} className="text-red-400" />
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                                Inactivo
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Editar */}
                          <motion.button
                            onClick={() => handleEdit(product)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-white hover:text-rose-300 rounded-lg transition-all"
                            title="Editar producto"
                          >
                            <Edit size={16} />
                          </motion.button>

                          {/* Activar/Desactivar */}
                          {product.isActive ? (
                            <motion.button
                              onClick={() => deleteProduct(product._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-white hover:text-rose-300 rounded-lg transition-all"
                              title="Desactivar producto"
                            >
                              <EyeOff size={16} />
                            </motion.button>
                          ) : (
                            <motion.button
                              onClick={() => reactivateProduct(product._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-white hover:text-green-300 rounded-lg transition-all"
                              title="Reactivar producto"
                            >
                              <RotateCcw size={16} />
                            </motion.button>
                          )}

                          {/* Eliminar permanentemente */}
                          <motion.button
                            onClick={() => permanentDeleteProduct(product._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-red-400 hover:text-red-300 rounded-lg transition-all"
                            title="ELIMINAR PERMANENTEMENTE"
                          >
                            <AlertTriangle size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <ImageIcon size={48} className="text-gray-500" />
                        <p className="text-gray-300 text-lg">No hay productos registrados</p>
                        <button
                          onClick={handleCreate}
                          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                        >
                          Crear primer producto
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de formulario */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={editingProduct ? updateProduct : createProduct}
        />
      )}
    </motion.div>
  );
}

function ProductModal({ product, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || 'maquillaje'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'maquillaje', label: 'Maquillaje' },
    { value: 'cuidado_facial', label: 'Cuidado Facial' },
    { value: 'cuidado_cabello', label: 'Cuidado del Cabello' },
    { value: 'cuidado_unas', label: 'Cuidado de Uñas' },
    { value: 'cuidado_piel', label: 'Cuidado de la Piel' },
    { value: 'accesorios', label: 'Accesorios' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category', formData.category);

      for (let i = 0; i < selectedFiles.length; i++) {
        data.append('images', selectedFiles[i]);
      }

      if (product) {
        await onSave(product._id, data);
      } else {
        await onSave(data);
      }

      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Máximo 5 imágenes permitidas');
      e.target.value = '';
      return;
    }
    setSelectedFiles(files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            {product ? 'Editar Producto' : 'Crear Producto'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre del producto *
            </label>
            <input
              type="text"
              placeholder="Ej: Labial Rosa Elegante"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              placeholder="Describe las características del producto..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl h-20 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Precio *
              </label>
              <input
                type="number"
                placeholder="25000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                required
                min="0"
                step="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Stock *
              </label>
              <input
                type="number"
                placeholder="10"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                required
                min="0"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}
                className="bg-white text-gray-800 py-2">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imágenes del producto {!product && '(máximo 5)'}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-gray-200 font-medium mb-2">
                  {selectedFiles.length} archivo(s) seleccionado(s):
                </p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {Array.from(selectedFiles).map((file, index) => (
                    <li key={index} className="truncate">
                      • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product && product.images && product.images.length > 0 && (
              <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-gray-200 font-medium mb-2">
                  Imágenes actuales ({product.images.length}):
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Imagen ${index + 1}`}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Las nuevas imágenes se agregarán a las existentes
                </p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-rose-500 border-white/20 text-gray-200 rounded-xl hover:bg-rose-600 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-rose-400 text-white rounded-xl hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {product ? 'Actualizando...' : 'Creando...'}
                </div>
              ) : (
                product ? 'Actualizar Producto' : 'Crear Producto'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
