// src/catalogue.tsx
import { useMemo, useState } from "react";
import ProductCard from "./components/ProductCard";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { PRODUCTS } from "./data/products";
import type { Product, ProductType as BaseProductType } from "./data/products";

type ProductType = "all" | BaseProductType;
type SortOption = "price-asc" | "price-desc" | "name-asc";

const ITEMS_PER_PAGE = 12;

export default function Catalogue() {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [typeFilter, setTypeFilter] = useState<ProductType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let result: Product[] = PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = p.price <= maxPrice;
      const matchesType = typeFilter === "all" ? true : p.type === typeFilter;

      return matchesSearch && matchesPrice && matchesType;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [search, maxPrice, sortBy, typeFilter]);

  // 📄 Paginación
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <main className="flex flex-col justify-between min-h-screen bg-[#F5F7F9]">
      <Header />

      <section className="flex-1 px-10 py-10">
        {/* Fila de filtros */}
        <div className="grid grid-cols-3 items-center gap-6 mb-10 max-w-6xl mx-auto">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="ti ti-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F0F1F0] text-sm text-slate-700 outline-none border border-transparent"
              />
            </div>
          </div>

          {/* Price range */}
          <div className="w-full flex items-center gap-4 bg-[#F0F1F0] rounded-full px-4 py-2">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Price Range
            </span>
            <span className="text-xs text-slate-400 whitespace-nowrap">$0</span>
            <input
              type="range"
              min={0}
              max={200}
              step={1}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-[#028414]"
            />
            <span className="text-xs text-slate-400 whitespace-nowrap">
              ${maxPrice}
            </span>
          </div>

          {/* Sort & Type */}
          <div className="w-full flex gap-3">
            {/* Sort by */}
            <div className="flex items-center gap-2 bg-[#F0F1F0] rounded-full px-3 py-2">
              <span className="text-xs text-slate-400">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-slate-600 outline-none cursor-pointer"
              >
                <option value="price-asc">Price</option>
                <option value="price-desc">Price ↓</option>
                <option value="name-asc">Name (A–Z)</option>
              </select>
            </div>

            {/* Type */}
            <div className="flex items-center gap-2 bg-[#F0F1F0] rounded-full px-3 py-2">
              <span className="text-xs text-slate-400">Type</span>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as ProductType);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-slate-600 outline-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="succulent">Succulent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de productos: altura mínima fija */}
        <div className="mx-32">
          <div className="grid gap-8 grid-cols-4 min-h-[680px]">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}

            {filteredProducts.length === 0 && (
              <p className="col-span-full text-center text-slate-500 self-center">
                No products found for the selected filters.
              </p>
            )}
          </div>
        </div>

        {/* Paginación */}
        {filteredProducts.length >= 0 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm rounded-full border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <i className="ti ti-chevron-left"></i>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, idx) => {
                const page = idx + 1;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm rounded-full border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <i className="ti ti-chevron-right"></i>
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
