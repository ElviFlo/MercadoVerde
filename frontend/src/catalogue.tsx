import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import ProductCard from "./components/ProductCard";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { PRODUCTS } from "./data/products";
import type { Product, ProductType as BaseProductType } from "./data/products";

type ProductType = "all" | BaseProductType;
type SortOption = "price-asc" | "price-desc" | "name-asc";

const ITEMS_PER_PAGE = 12;

// Lee el JWT del localStorage y devuelve si es admin
function isAdminFromToken(): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;

    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, "=");
    const json = atob(padded);
    const payload = JSON.parse(json) as { role?: string; roles?: string[] };

    const mainRole = payload.role ?? payload.roles?.[0];
    return mainRole === "admin";
  } catch {
    return false;
  }
}

export default function Catalogue() {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [typeFilter, setTypeFilter] = useState<ProductType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<{
    name: string;
    price: string;
    type: BaseProductType;
    imageUrl: string;
  }>({
    name: "",
    price: "",
    type: "indoor",
    imageUrl: "",
  });

  const isAdmin = isAdminFromToken();

  const handleCreateProductSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Crear producto:", newProduct);

    setNewProduct({
      name: "",
      price: "",
      type: "indoor",
      imageUrl: "",
    });
    setIsCreateModalOpen(false);
  };

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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <main className="flex flex-col justify-between min-h-screen bg-[#F5F7F9]">
      <Header />

      <section className="flex-1 px-10 py-10">
        {/* Fila de filtros */}
        <div className="grid grid-cols-6 items-center gap-3 mb-10 max-w-4xl mx-auto">
          {/* Search */}
          <div className={`${isAdmin ? "col-span-3" : "col-span-2"} w-full h-full`}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666D68]">
                <i className="ti ti-search"></i>
              </span>
              <input type="text" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2 rounded-full bg-[#EAEBEA] text-sm text-[#90A1B9] outline-none border border-transparent"/>
            </div>
          </div>

            {/* Sort by */}
            <div className="flex items-center h-full gap-2 bg-[#EAEBEA] rounded-full px-3 py-2">
              <span className="text-xs text-[#90A1B9]">Sort</span>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }} className="bg-transparent text-xs font-semibold text-[#666D68] outline-none cursor-pointer">
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="name-asc">Name (A–Z)</option>
              </select>
            </div>

            {/* Type */}
            <div className="flex items-center h-full gap-2 bg-[#EAEBEA] rounded-full px-3 py-2">
              <span className="text-xs text-[#90A1B9]">Type</span>
              <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as ProductType); setCurrentPage(1); }} className="bg-transparent text-xs font-semibold text-[#666D68] outline-none cursor-pointer">
                <option value="all">All</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="succulent">Succulent</option>
                <option value="cacti">Cactus</option>
                <option value="aromatic">Aromatic</option>
                <option value="flowering">Flowering</option>
              </select>
            </div>

            {/* Crear Producto (solo admin) */}
            {isAdmin && (
              <button onClick={() => setIsCreateModalOpen(true)} className="w-full flex items-center justify-center bg-[#53D15E] rounded-full h-full cursor-pointer hover:bg-[#33B13E] text-white text-sm font-medium transition-colors duration-200">
                Create Product
              </button>
            )}

            {/* Modal Create Product (solo admin) */}
            {isAdmin && isCreateModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors duration-200">
                    <i className="ti ti-x" />
                  </button>

                  <h2 className="text-lg font-semibold text-slate-900 mb-1">Create Product</h2>
                  <p className="text-xs text-slate-500 mb-4">Fill the fields below to add a new product to the catalogue.</p>

                  <form onSubmit={handleCreateProductSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
                      <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent"/>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Price (USD)</label>
                      <input type="number" min={0} step="0.01" required value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent"/>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                      <select value={newProduct.type} onChange={(e) => setNewProduct((p) => ({ ...p, type: e.target.value as BaseProductType }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent bg-white">
                        <option value="indoor">Indoor</option>
                        <option value="outdoor">Outdoor</option>
                        <option value="succulent">Succulent</option>
                        <option value="cacti">Cactus</option>
                        <option value="aromatic">Aromatic</option>
                        <option value="flowering">Flowering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Image URL</label>
                      <input type="text" placeholder="/plants/plant-13.png" value={newProduct.imageUrl} onChange={(e) => setNewProduct((p) => ({ ...p, imageUrl: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent"/>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors duration-200">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-[#53D15E] rounded-lg hover:bg-[#33B13E] cursor-pointer transition-colors duration-200">
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Price range (solo client / no logged) */}
            <div className={`${isAdmin ? "hidden" : "flex"} w-full col-span-2 items-center gap-4 bg-[#EAEBEA] rounded-full px-4 py-2 h-full`}>
              <span className="text-xs text-[#90A1B9] whitespace-nowrap">Price Range</span>
              <input type="range" min={0} max={200} step={1} value={maxPrice} onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }} className="w-full accent-[#028414]"/>
              <span className="text-xs font-medium text-[#666D68] whitespace-nowrap">${maxPrice}</span>
            </div>
        </div>

        {/* Grid de productos: altura mínima fija */}
        <div className="mx-32">
          <div className="grid gap-8 grid-cols-4 min-h-[680px] content-start items-start">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} imageUrl={product.imageUrl}/>
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
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="text-sm text-slate-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100">
              <i className="ti ti-chevron-left"></i>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, idx) => {
                const page = idx + 1;
                const isActive = page === currentPage;
                return (
                  <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 rounded-full text-sm font-medium cursor-pointer ${isActive ? "bg-[#EAEBEA] text-text-[#666D68]" : "text-slate-700"}`}>
                    {page}
                  </button>
                );
              })}
            </div>

            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="text-sm rounded-full text-slate-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100">
              <i className="ti ti-chevron-right"></i>
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
