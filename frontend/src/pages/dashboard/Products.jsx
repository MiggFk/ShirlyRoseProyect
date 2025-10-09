import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";
import { Edit, Trash2, Plus } from "lucide-react";

export default function Products() {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar producto",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Nombre" />
        <textarea id="swal-input-description" class="swal2-textarea" placeholder="Descripción"></textarea>
        <input id="swal-input-price" type="number" class="swal2-input" placeholder="Precio" />
        <input id="swal-input-stock" type="number" class="swal2-input" placeholder="Stock" />
        <input id="swal-input-image" class="swal2-input" placeholder="URL de imagen" />
        <input id="swal-input-category" class="swal2-input" placeholder="Categoría" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => ({
        name: document.getElementById("swal-input-name").value,
        description: document.getElementById("swal-input-description").value,
        price: Number(document.getElementById("swal-input-price").value),
        stock: Number(document.getElementById("swal-input-stock").value),
        image: document.getElementById("swal-input-image").value,
        category: document.getElementById("swal-input-category").value,
      }),
    });

    if (formValues) await createProduct(formValues);
  };

  const handleEdit = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar producto",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Nombre" value="${product.name}" />
        <textarea id="swal-input-description" class="swal2-textarea" placeholder="Descripción">${product.description}</textarea>
        <input id="swal-input-price" type="number" class="swal2-input" placeholder="Precio" value="${product.price}" />
        <input id="swal-input-stock" type="number" class="swal2-input" placeholder="Stock" value="${product.stock}" />
        <input id="swal-input-image" class="swal2-input" placeholder="URL de imagen" value="${product.image}" />
        <input id="swal-input-category" class="swal2-input" placeholder="Categoría" value="${product.category}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => ({
        name: document.getElementById("swal-input-name").value,
        description: document.getElementById("swal-input-description").value,
        price: Number(document.getElementById("swal-input-price").value),
        stock: Number(document.getElementById("swal-input-stock").value),
        image: document.getElementById("swal-input-image").value,
        category: document.getElementById("swal-input-category").value,
      }),
    });

    if (formValues) await updateProduct(product._id, formValues);
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
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-3xl font-bold text-white drop-shadow-lg"
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
          className="flex items-center gap-2 bg-rose-300 text-rose-600 font-bold px-5 py-2 rounded-full shadow-md hover:bg-rose-500 hover:text-white transition"
        >
          <Plus size={18} />
          Agregar
        </motion.button>
      </div>

      {/* Tabla con efecto glass/liquid */}
<motion.div
  className="rounded-3xl overflow-hidden
             bg-white/10 backdrop-blur-2xl
             border border-white/30 shadow-lg"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <table className="min-w-full text-sm text-left text-gray-100 rounded-3xl overflow-hidden">
    {/* Encabezado */}
    <thead className="bg-white/10 backdrop-blur-xl border-b border-white/10 rounded-t-3xl">
      <tr className="text-rose-300">
        <th className="py-3 px-4 font-semibold">Nombre</th>
        <th className="py-3 px-4 hidden sm:table-cell font-semibold">Descripción</th>
        <th className="py-3 px-4 font-semibold">Precio</th>
        <th className="py-3 px-4 font-semibold">Stock</th>
        <th className="py-3 px-4 text-center font-semibold">Acciones</th>
      </tr>
    </thead>

    {/* Cuerpo */}
    <tbody className="rounded-b-3xl overflow-hidden">
      <AnimatePresence>
        {products.length > 0 ? (
          products.map((p) => (
            <motion.tr
              key={p._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="border-b border-white/10
                         bg-white/10 backdrop-blur-1xl
                         hover:bg-white/20
                         transition-all last:rounded-b-3xl"
            >
              <td className="py-3 px-4 font-medium text-gray-100">{p.name}</td>
              <td className="py-3 px-4 text-gray-200 hidden sm:table-cell">{p.description}</td>
              <td className="py-3 px-4 text-gray-100 font-semibold">${p.price}</td>
              <td className="py-3 px-4 text-gray-100">{p.stock}</td>
              <td className="py-3 px-4 text-center space-x-2">
                <motion.button
                  onClick={() => handleEdit(p)}
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-9 h-9 text-white transition"
                  aria-label="Editar"
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  onClick={() => deleteProduct(p._id)}
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
            <td colSpan="5" className="text-center py-8 text-gray-300 text-lg">
              No hay productos registrados
            </td>
          </tr>
        )}
      </AnimatePresence>
    </tbody>
  </table>
</motion.div>

    </motion.div>
  );
}
