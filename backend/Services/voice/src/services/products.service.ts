import axios from "axios";

const PRODUCTS_BASE_URL =
  process.env.PRODUCTS_BASE_URL ?? "http://products:3003";

export const ProductsService = {
  async searchProducts(query: string, authHeader?: string) {
    console.log(
      "[ProductsService.searchProducts] q:",
      query,
      "auth?",
      !!authHeader
    );

    // Ajusta la ruta si tu endpoint real de búsqueda es otro
    const res = await axios.get(`${PRODUCTS_BASE_URL}/products`, {
      params: { q: query }, // si tu /products no usa q, puedes quitar params
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    return res.data;
  },
};
