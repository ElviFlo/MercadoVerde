import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { PRODUCTS } from "./data/products";
import type { Product } from "./data/products";
import type React from "react";

export default function Product() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<{ name: string; price: string; type: Product["type"]; imageUrl: string }>({
    name: "",
    price: "",
    type: "indoor" as Product["type"],
    imageUrl: "",
  });

  const product: Product | undefined = PRODUCTS.find((p) => p.id === numericId);

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Product not found</p>
            <Link to="/catalogue" className="text-emerald-600 underline font-medium">
              Go back to catalogue
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const images: string[] = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleModifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedProduct: Product = {
        ...product,
        name: editProduct.name || product.name,
        price: editProduct.price ? Number(editProduct.price) : product.price,
        type: editProduct.type || product.type,
        imageUrl: editProduct.imageUrl || product.imageUrl,
      };
    console.log("Modified product:", updatedProduct);
    setIsModifyModalOpen(false);
  };

  const rating = 4.6;
  const ratingCount = 556;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="flex-1 px-16 py-10 flex">
        <div className="w-1/2 pr-12 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3 text-sm text-slate-400">
            <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1 cursor-pointer">
              <i className="ti ti-chevron-left text-base" />
            </button>
            <span>Indoor</span>
            <span>/</span>
            <span className="text-slate-500">{product.name}</span>
          </div>

          <h1 className="text-4xl font-semibold text-slate-900 mb-3">{product.name}</h1>

          <p className="text-2xl font-semibold text-slate-900 mb-3">${product.price.toFixed(2)}</p>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-[#53D15E] text-lg">
              <i className="ti ti-star-filled"></i>
              <i className="ti ti-star-filled"></i>
              <i className="ti ti-star-filled"></i>
              <i className="ti ti-star-filled"></i>
              <i className="ti ti-star-half-filled"></i>
            </div>
            <span className="text-xs text-[#53D15E] font-semibold">{rating.toFixed(1)} / 5.0</span>
            <span className="text-xs text-slate-400">({ratingCount.toLocaleString()})</span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-md">
            Elegant and resilient, the {product.name} thrives in almost any environment. Its tall, sword-like leaves purify the air and add a modern touch to your space. Low-maintenance and perfect for beginners.
          </p>

          {/* Agregar al carrito (Cliente) */}
          <div className="hidden items-center gap-4 mb-6">
            <div className="flex items-center border border-slate-200 rounded-full px-4 py-2 gap-6">
              <button type="button" onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))} className="text-lg text-slate-700 hover:text-slate-900 cursor-pointer">
                <i className="ti ti-minus"></i>
              </button>
              <span className="text-sm font-medium text-slate-800 min-w-6 text-center">{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)} className="text-lg text-slate-700 hover:text-slate-900 cursor-pointer">
                <i className="ti ti-plus"></i>
              </button>
            </div>
            <button type="button" className="px-8 py-3 rounded-full bg-[#53D15E] text-white text-sm font-semibold cursor-pointer hover:bg-[#33B13E] transition-colors duration-200" onClick={() => { console.log("Add to cart:", { productId: product.id, quantity }); }}>
              Add to Cart
            </button>
          </div>

          {/* Modificar (Administrador) */}
          <div className="flex items-center gap-4 mb-6">
            <button type="button" className="px-8 py-3 rounded-full bg-[#53D15E] text-white text-sm font-semibold cursor-pointer hover:bg-[#33B13E] transition-colors duration-200" onClick={() => { setEditProduct({ name: product.name, price: product.price.toString(), type: product.type, imageUrl: product.imageUrl }); setIsModifyModalOpen(true); }}>
              Modify
            </button>
            <button type="button" className="px-8 py-3 rounded-full bg-[#FD7C7E] text-white text-sm font-semibold cursor-pointer hover:bg-[#ED5C5E] transition-colors duration-200" onClick={() => { console.log("Delete product:", { productId: product.id }); }}>
              Delete
            </button>
          </div>

          <div className="flex gap-6 text-xs text-slate-500">
            <span>Free 3–5 day shipping</span>
            <span>•</span>
            <span>30-day trial</span>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="w-1/2 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-end gap-4 text-sm mb-4 text-slate-400">
            <span className="font-semibold text-slate-700 mr-1">{String(currentImage + 1).padStart(2, "0")}</span>
            <span>/ {String(images.length).padStart(2, "0")}</span>

            <div className="flex gap-2 ml-4">
              <button type="button" onClick={handlePrevImage} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
                <i className="ti ti-chevron-left text-xs text-slate-600 cursor-pointer" />
              </button>
              <button type="button" onClick={handleNextImage} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
                <i className="ti ti-chevron-right text-xs text-slate-600 cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center mb-6">
            <div className="relative w-[380px] h-[380px] bg-[#F4FAF6] rounded-full flex items-center justify-center shadow-sm">
              <img src={images[currentImage]} alt={product.name} className="h-[260px] object-contain" />
            </div>
          </div>

          <div className="flex gap-4">
            {images.map((img, index) => {
              const isActive = index === currentImage;
              return (
                <button key={index} type="button" onClick={() => setCurrentImage(index)} className={`w-20 h-20 border rounded-xl flex items-center justify-center bg-white transition-shadow cursor-pointer ${isActive ? "border-emerald-500 shadow-sm" : "border-slate-200 hover:border-emerald-300"}`}>
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="h-14 object-contain" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de Modify (Administrador) */}
      {isModifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button type="button" onClick={() => setIsModifyModalOpen(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
              <i className="ti ti-x" />
            </button>

            <h2 className="text-lg font-semibold text-slate-900 mb-1">Modify Product</h2>
            <p className="text-xs text-slate-500 mb-4">Update the fields below to modify this product.</p>

            <form onSubmit={handleModifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
                <input type="text" required value={editProduct.name} onChange={(e) => setEditProduct((p) => ({ ...p, name: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Price (USD)</label>
                <input type="number" min={0} step="0.01" required value={editProduct.price} onChange={(e) => setEditProduct((p) => ({ ...p, price: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                <select value={editProduct.type} onChange={(e) => setEditProduct((p) => ({ ...p, type: e.target.value as Product["type"] }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent bg-white">
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="succulent">Succulent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Image URL</label>
                <input type="text" placeholder="/plants/plant-1.png" value={editProduct.imageUrl} onChange={(e) => setEditProduct((p) => ({ ...p, imageUrl: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModifyModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 rounded-lg hover:bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-[#028414] rounded-lg hover:bg-[#026c11]">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
