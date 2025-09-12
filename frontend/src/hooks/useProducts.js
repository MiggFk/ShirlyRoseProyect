import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtener productos
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");
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

    // Crear producto
    const createProduct = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/products", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Éxito", "Producto creado correctamente", "success");
            await fetchProducts(); // <-- Vuelve a cargar los productos
        } catch (err) {
            console.error("Error al crear producto:", err);
            Swal.fire("Error", "No se pudo crear el producto", "error");
        }
    };

    // Actualizar producto
    const updateProduct = async (id, data) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/products/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
            await fetchProducts(); // <-- Vuelve a cargar los productos
        } catch (err) {
            console.error("Error al actualizar producto:", err);
            Swal.fire("Error", "No se pudo actualizar el producto", "error");
        }
    };

    // Eliminar producto
    const deleteProduct = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (!confirm.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
            await fetchProducts(); // <-- Vuelve a cargar los productos
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            Swal.fire("Error", "No se pudo eliminar el producto", "error");
        }
    };

    return {
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchProducts,
    };
}