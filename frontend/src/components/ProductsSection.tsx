// src/components/ProductsSection.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import type { Product } from "../data/products";
import { fetchProducts } from "../api/products";

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const backendProducts = await fetchProducts();
        setProducts(backendProducts);
      } catch (err) {
        console.error("Error fetching products for home:", err);
        const message =
          err instanceof Error ? err.message : "Error loading products";
        setLoadError(message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Solo mostramos los primeros 12 en el home
  const visibleProducts = products.slice(0, 12);

  return (
    <section className="w-full py-16 bg-white">
      {/* Título */}
      <div className="text-center mb-10">
        <h2 className="text-5xl text-slate-900 mb-2">Products</h2>
        <p className="text-sm text-slate-500">
          Order it for you or for your beloved ones
        </p>
      </div>

      {/* Grid de productos */}
      <div className="max-w-6xl mx-auto px-4">
        {loadError && (
          <p className="text-center text-sm text-red-500 mb-4">
            {loadError}
          </p>
        )}

        {isLoading ? (
          <div className="min-h-[200px] flex items-center justify-center text-slate-500 text-sm">
            Loading products...
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={
                  product.imageUrl ?? "/plants/plant-placeholder.png"
                }
              />
            ))}

            {visibleProducts.length === 0 && (
              <p className="col-span-full text-center text-slate-500">
                No products available at the moment.
              </p>
            )}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 text-[#026910] font-semibold hover:text-[#329940] transition-colors duration-200"
          >
            <span>Ver más</span>
            <i className="ti ti-chevron-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
