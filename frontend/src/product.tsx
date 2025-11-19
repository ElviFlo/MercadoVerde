// src/product.tsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { PRODUCTS } from "./data/products";
import type { Product } from "./data/products";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  // Hooks SIEMPRE al principio, sin condicionales
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const product: Product | undefined = PRODUCTS.find(
    (p) => p.id === numericId
  );

  // Si no se encuentra el producto: UI de error, pero las hooks ya se llamaron
  if (!product) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Product not found</p>
            <Link
              to="/catalogue"
              className="text-emerald-600 underline font-medium"
            >
              Go back to catalogue
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // A partir de aquí ya sabemos que product existe
  const images: string[] = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ];

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const rating = 4.6;
  const ratingCount = 556;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="flex-1 px-16 py-10 flex">
        {/* Columna izquierda */}
        <div className="w-1/2 pr-12 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3 text-sm text-slate-400">
            <Link to="/catalogue" className="flex items-center gap-1">
              <i className="ti ti-arrow-left text-base"></i>
            </Link>
            <span>Indoor</span>
            <span>/</span>
            <span className="text-slate-500">{product.name}</span>
          </div>

          <h1 className="text-4xl font-semibold text-slate-900 mb-3">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold text-slate-900 mb-3">
            ${product.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-emerald-500 text-lg">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span className="text-slate-300">★</span>
            </div>
            <span className="text-xs text-emerald-600 font-semibold">
              {rating.toFixed(1)} / 5.0
            </span>
            <span className="text-xs text-slate-400">
              ({ratingCount.toLocaleString()})
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-md">
            Elegant and resilient, the {product.name} thrives in almost any
            environment. Its tall, sword-like leaves purify the air and add a
            modern touch to your space. Low-maintenance and perfect for
            beginners.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-slate-200 rounded-lg px-4 py-2 gap-6">
              <button
                type="button"
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                className="text-lg text-slate-700 hover:text-slate-900"
              >
                <i className="ti ti-minus"></i>
              </button>
              <span className="text-sm font-medium text-slate-800 min-w-[1.5rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="text-lg text-slate-700 hover:text-slate-900"
              >
                <i className="ti ti-plus"></i>
              </button>
            </div>

            <button
              type="button"
              className="px-8 py-3 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
              onClick={() => {
                console.log("Add to cart:", { productId: product.id, quantity });
              }}
            >
              Add to Cart
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
            <span className="font-semibold text-slate-700 mr-1">
              {String(currentImage + 1).padStart(2, "0")}
            </span>
            <span>/ {String(images.length).padStart(2, "0")}</span>

            <div className="flex gap-2 ml-4">
              <button
                type="button"
                onClick={handlePrevImage}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100"
              >
                <i className="ti ti-chevron-left text-xs text-slate-600" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100"
              >
                <i className="ti ti-chevron-right text-xs text-slate-600" />
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center mb-6">
            <div className="relative w-[380px] h-[380px] bg-[#F4FAF6] rounded-full flex items-center justify-center shadow-sm">
              <img
                src={images[currentImage]}
                alt={product.name}
                className="h-[260px] object-contain"
              />
            </div>
          </div>

          <div className="flex gap-4">
            {images.map((img, index) => {
              const isActive = index === currentImage;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 border rounded-xl flex items-center justify-center bg-white transition-shadow ${
                    isActive
                      ? "border-emerald-500 shadow-sm"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-14 object-contain"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
