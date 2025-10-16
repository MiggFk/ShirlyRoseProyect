import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtener productos ADMIN (incluye inactivos)
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await api.get("/products/admin/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Error al cargar productos:", err);
            Swal.fire("Error", "No se pudieron cargar los productos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Crear producto con FormData (para archivos)
    const createProduct = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/products", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            Swal.fire("Éxito", "Producto creado correctamente", "success");
            await fetchProducts();
        } catch (err) {
            console.error("Error al crear producto:", err);
            const errorMsg = err.response?.data?.message || "No se pudo crear el producto";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    // Actualizar producto con FormData
    const updateProduct = async (id, formData) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/products/${id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
            await fetchProducts();
        } catch (err) {
            console.error("Error al actualizar producto:", err);
            const errorMsg = err.response?.data?.message || "No se pudo actualizar el producto";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    // Desactivar producto (soft delete)
    const deleteProduct = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Desactivar producto?",
            text: "El producto se ocultará del público pero no se eliminará",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
        });

        if (!confirm.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Desactivado", "Producto desactivado correctamente", "success");
            await fetchProducts();
        } catch (err) {
            console.error("Error al desactivar producto:", err);
            Swal.fire("Error", "No se pudo desactivar el producto", "error");
        }
    };

    // Reactivar producto
    const reactivateProduct = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await api.patch(`/products/${id}/reactivate`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Reactivado", "Producto reactivado correctamente", "success");
            await fetchProducts();
        } catch (err) {
            console.error("Error al reactivar producto:", err);
            Swal.fire("Error", "No se pudo reactivar el producto", "error");
        }
    };

    // Eliminar permanentemente
    const permanentDeleteProduct = async (id) => {
        const confirm = await Swal.fire({
            title: "⚠️ ¡PELIGRO!",
            html: "Esto <strong>ELIMINARÁ PERMANENTEMENTE</strong> el producto y todas sus imágenes.<br><br>Esta acción <strong>NO se puede deshacer</strong>.",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "SÍ, ELIMINAR PARA SIEMPRE",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            focusCancel: true,
        });

        if (!confirm.isConfirmed) return;

        // Segunda confirmación
        const finalConfirm = await Swal.fire({
            title: "¿Estás 100% seguro?",
            text: "Escribe 'ELIMINAR' para confirmar",
            input: 'text',
            inputPlaceholder: 'Escribe: ELIMINAR',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ELIMINAR DEFINITIVAMENTE",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
            preConfirm: (inputValue) => {
                if (inputValue !== 'ELIMINAR') {
                    Swal.showValidationMessage('Debes escribir exactamente: ELIMINAR');
                    return false;
                }
                return true;
            }
        });

        if (!finalConfirm.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/products/${id}/permanent`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Eliminado", "Producto eliminado permanentemente", "success");
            await fetchProducts();
        } catch (err) {
            console.error("Error al eliminar permanentemente:", err);
            Swal.fire("Error", "No se pudo eliminar el producto", "error");
        }
    };

    return {
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        reactivateProduct,         // ← Nueva función
        permanentDeleteProduct,    // ← Nueva función
        fetchProducts,
    };
}