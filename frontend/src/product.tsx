// src/product.tsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import type { Product } from "./data/products";
import type React from "react";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  type UpdateProductPayload,
} from "./api/products";

// Misma función que en catalogue.tsx
function isAdminFromToken(): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;

    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadBase64.padEnd(
      Math.ceil(payloadBase64.length / 4) * 4,
      "=",
    );
    const json = atob(padded);
    const payload = JSON.parse(json) as { role?: string; roles?: string[] };

    const mainRole = payload.role ?? payload.roles?.[0];
    return mainRole === "admin";
  } catch {
    return false;
  }
}

export default function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editProduct, setEditProduct] = useState<{
    name: string;
    description: string;
    price: string;
    stock: string;
    type: Product["type"];
    imageUrl: string;
  }>({
    name: "",
    description: "",
    price: "",
    stock: "0",
    type: "indoor" as Product["type"],
    imageUrl: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const ZOOMS = [
    { label: "Full", scale: 1.0, x: 0, y: 0 },
    { label: "Top", scale: 2.0, x: 0, y: -20 },
    { label: "Bottom", scale: 2.0, x: 0, y: 20 },
    { label: "Left", scale: 2.0, x: -20, y: 0 },
    { label: "Right", scale: 5.0, x: 20, y: 0 },
  ];

  const [currentZoom, setCurrentZoom] = useState(0);

  const isAdmin = isAdminFromToken();

  useEffect(() => {
    if (!id) {
      setErrorMsg("Invalid product id");
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const p = await getProductById(id);
        setProduct(p);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.message ?? "Error loading product");
        setProduct(null);
        setToast({
          type: "error",
          message: err?.message ?? "Error loading product",
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  const rating = 4.6;
  const ratingCount = 556;

  // 🔧 Handle MODIFY (PUT /products/:id)
  const handleModifySubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!product) return;

    try {
      const nameTrimmed = editProduct.name.trim();
      if (!nameTrimmed) {
        setToast({
          type: "error",
          message: "Name is required",
        });
        return;
      }

      const priceNumber = Number.parseFloat(editProduct.price);
      if (Number.isNaN(priceNumber) || priceNumber < 0) {
        setToast({
          type: "error",
          message: "Price must be a valid non-negative number",
        });
        return;
      }

      const stockNumber = Number.parseInt(editProduct.stock, 10);
      if (Number.isNaN(stockNumber) || stockNumber < 0) {
        setToast({
          type: "error",
          message: "Stock must be a valid non-negative integer",
        });
        return;
      }

      const descriptionTrimmed = editProduct.description.trim();
      const imageTrimmed = editProduct.imageUrl.trim();

      const payload: UpdateProductPayload = {
        name: nameTrimmed,
        description: descriptionTrimmed,
        price: priceNumber,
        stock: stockNumber,
        type: editProduct.type,
        imageUrl: imageTrimmed === "" ? undefined : imageTrimmed,
      };

      const updated = await updateProduct(product.id.toString(), payload);

      setProduct(updated);
      setIsModifyModalOpen(false);
      setToast({
        type: "success",
        message: "Product updated successfully ✅",
      });
    } catch (err: any) {
      console.error(err);
      setToast({
        type: "error",
        message: err?.message ?? "Error updating product",
      });
    }
  };

  // 🗑️ Handle DELETE (DELETE /products/:id)
  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product.id.toString());
      setToast({
        type: "success",
        message: "Product deleted successfully 🗑️",
      });
      setProduct(null);
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setToast({
        type: "error",
        message: err?.message ?? "Error deleting product",
      });
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm">Loading product...</p>
        </section>
        <Footer />

        {toast && (
          <div
            className={`fixed bottom-4 right-4 z-50 max-w-xs text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2
              ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}
            `}
          >
            <i
              className={`ti ${
                toast.type === "error" ? "ti-alert-circle" : "ti-check"
              } text-lg`}
            />
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-xs opacity-80 hover:opacity-100 underline"
            >
              Close
            </button>
          </div>
        )}
      </main>
    );
  }

  if (!product || errorMsg) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">
              {errorMsg ?? "Product not found"}
            </p>
            <Link
              to="/catalogue"
              className="text-emerald-600 underline font-medium"
            >
              Go back to catalogue
            </Link>
          </div>
        </section>
        <Footer />

        {toast && (
          <div
            className={`fixed bottom-4 right-4 z-50 max-w-xs text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2
              ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}
            `}
          >
            <i
              className={`ti ${
                toast.type === "error" ? "ti-alert-circle" : "ti-check"
              } text-lg`}
            />
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-xs opacity-80 hover:opacity-100 underline"
            >
              Close
            </button>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="flex-1 px-16 py-10 flex">
        <div className="w-1/2 pr-12 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3 text-sm text-slate-400">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <i className="ti ti-chevron-left text-base" />
            </button>
            <span>{product.type === "indoor" ? "Indoor" : "Plant"}</span>
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
            <div className="flex text-[#53D15E] text-lg">
              <i className="ti ti-star-filled" />
              <i className="ti ti-star-filled" />
              <i className="ti ti-star-filled" />
              <i className="ti ti-star-filled" />
              <i className="ti ti-star-half-filled" />
            </div>
            <span className="text-xs text-[#53D15E] font-semibold">
              {rating.toFixed(1)} / 5.0
            </span>
            <span className="text-xs text-slate-400">
              ({ratingCount.toLocaleString()})
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-md">
            {product.description
              ? product.description
              : `Elegant and resilient, the ${product.name} thrives in almost any environment. Its tall, sword-like leaves purify the air and add a modern touch to your space. Low-maintenance and perfect for beginners.`}
          </p>

          {/* Agregar al carrito (Cliente / no admin) */}
          {!isAdmin && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-slate-200 rounded-full px-4 py-2 gap-6">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="text-lg text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <i className="ti ti-minus" />
                </button>
                <span className="text-sm font-medium text-slate-800 min-w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-lg text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <i className="ti ti-plus" />
                </button>
              </div>
              <button
                type="button"
                className="px-8 py-3 rounded-full bg-[#53D15E] text-white text-sm font-semibold cursor-pointer hover:bg-[#33B13E] transition-colors duration-200"
                onClick={() => {
                  console.log("Add to cart:", {
                    productId: product.id,
                    quantity,
                  });
                }}
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Modificar / Delete (Administrador) */}
          {isAdmin && (
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                className="px-8 py-3 rounded-full bg-[#53D15E] text-white text-sm font-semibold cursor-pointer hover:bg-[#33B13E] transition-colors duration-200"
                onClick={() => {
                  setEditProduct({
                    name: product.name,
                    description: product.description ?? "",
                    price: product.price.toString(),
                    stock:
                      typeof product.stock === "number"
                        ? product.stock.toString()
                        : "0",
                    type: product.type,
                    imageUrl: product.imageUrl,
                  });
                  setIsModifyModalOpen(true);
                }}
              >
                Modify
              </button>
              <button
                type="button"
                className="px-8 py-3 rounded-full bg-[#FD7C7E] text-white text-sm font-semibold cursor-pointer hover:bg-[#ED5C5E] transition-colors duration-200"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </button>
            </div>
          )}

          <div className="flex gap-6 text-xs text-slate-500">
            <span>Free 3–5 day shipping</span>
            <span>•</span>
            <span>30-day trial</span>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="w-1/2 flex flex-col items-center justify-center">
          {/* contador + flechas */}
          <div className="w-full flex items-center justify-end gap-4 text-sm mb-4 text-slate-400">
            <span className="font-semibold text-slate-700 mr-1">
              {String(currentZoom + 1).padStart(2, "0")}
            </span>
            <span>/ {String(ZOOMS.length).padStart(2, "0")}</span>

            <div className="flex gap-2 ml-4">
              <button
                type="button"
                onClick={() =>
                  setCurrentZoom((z) => (z === 0 ? ZOOMS.length - 1 : z - 1))
                }
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 cursor-pointer transition-colors duration-200"
              >
                <i className="ti ti-chevron-left text-xs text-slate-600" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentZoom((z) =>
                    z === ZOOMS.length - 1 ? 0 : z + 1,
                  )
                }
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 cursor-pointer transition-colors duration-200"
              >
                <i className="ti ti-chevron-right text-xs text-slate-600" />
              </button>
            </div>
          </div>

          {/* imagen principal con zoom/crop */}
          <div className="w-full flex justify-center mb-6">
            <div className="relative w-[380px] h-[380px] bg-[#F4FAF6] rounded-full flex items-center justify-center shadow-sm overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-[260px] object-contain transition-transform duration-300"
                style={{
                  transform: `scale(${ZOOMS[currentZoom].scale}) translate(${ZOOMS[currentZoom].x}%, ${ZOOMS[currentZoom].y}%)`,
                  transformOrigin: "center",
                }}
              />
            </div>
          </div>

          {/* thumbnails */}
          <div className="flex gap-4">
            {ZOOMS.map((zoom, index) => {
              const isActive = index === currentZoom;
              return (
                <button
                  key={zoom.label}
                  type="button"
                  onClick={() => setCurrentZoom(index)}
                  className={`w-20 h-20 border rounded-xl flex items-center justify-center bg-white transition-shadow cursor-pointer ${
                    isActive
                      ? "border-emerald-500 shadow-sm"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="w-16 h-16 overflow-hidden rounded-lg bg-[#F4FAF6] flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={`${product.name} ${zoom.label}`}
                      className="h-14 object-contain transition-transform duration-300"
                      style={{
                        transform: `scale(${zoom.scale}) translate(${zoom.x}%, ${zoom.y}%)`,
                        transformOrigin: "center",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de Modify (solo admin) */}
      {isAdmin && isModifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              type="button"
              onClick={() => setIsModifyModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <i className="ti ti-x" />
            </button>

            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Modify Product
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Update the fields below to modify this product.
            </p>

            <form onSubmit={handleModifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct((p) => ({
                      ...p,
                      name: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Price (USD)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct((p) => ({
                      ...p,
                      price: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct((p) => ({
                      ...p,
                      stock: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Type
                </label>
                <select
                  value={editProduct.type}
                  onChange={(e) =>
                    setEditProduct((p) => ({
                      ...p,
                      type: e.target.value as Product["type"],
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent bg-white"
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="succulent">Succulent</option>
                  <option value="cacti">Cactus</option>
                  <option value="aromatic">Aromatic</option>
                  <option value="flowering">Flowering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="/plants/plant-1.png"
                  value={editProduct.imageUrl}
                  onChange={(e) =>
                    setEditProduct((p) => ({
                      ...p,
                      imageUrl: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#028414] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModifyModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-[#028414] rounded-lg hover:bg-[#026c11]"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de Delete (solo admin) */}
      {isAdmin && isDeleteModalOpen && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <i className="ti ti-x" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="mt-1">
                <i className="ti ti-alert-triangle text-red-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Delete product
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{product.name}</span>? This
                  action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-medium text-white bg-[#FD7C7E] rounded-lg hover:bg-[#ED5C5E]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-xs text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2
            ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}
          `}
        >
          <i
            className={`ti ${
              toast.type === "error" ? "ti-alert-circle" : "ti-check"
            } text-lg`}
          />
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-xs opacity-80 hover:opacity-100 underline"
          >
            Close
          </button>
        </div>
      )}
    </main>
  );
}
