import { useState, useEffect } from "react";
import api from "../api/axios";

export function usePublicProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            // 🔑 CLAVE: Sin headers de autorización para rutas públicas
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error al cargar productos públicos:", err);
            setError("No se pudieron cargar los productos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, refetch: fetchProducts };
}