// src/cart.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CartItem from "./components/cartItem";

import {
  getCartItems,
  setCartItems,
  type CartItemData,
} from "./cartStorage";

import { createOrderFromCart } from "./api/orders";
import { syncLocalCartToBackend } from "./api/cart";

function getNameFromToken(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadBase64.padEnd(
      Math.ceil(payloadBase64.length / 4) * 4,
      "=",
    );
    const json = atob(padded);
    const payload = JSON.parse(json) as {
      name?: string;
      email?: string;
    };

    return payload.name ?? payload.email ?? null;
  } catch {
    return null;
  }
}

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState<CartItemData[]>(() => getCartItems());
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sincroniza con localStorage cada vez que cambien los items
  useEffect(() => {
    setCartItems(items);
  }, [items]);

  // Releer carrito cuando Kora lo modifique
  useEffect(() => {
    const reloadFromLocal = () => {
      setItems(getCartItems());
    };

    // carga inicial por si algo lo actualizó antes
    reloadFromLocal();

    window.addEventListener("kora-cart-updated", reloadFromLocal);
    return () => {
      window.removeEventListener("kora-cart-updated", reloadFromLocal);
    };
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const coupon = 0;
  const total = subtotal + shipping - coupon;

  const handleBuyNow = async () => {
    if (items.length === 0) {
      setToast({
        type: "error",
        message: "Your cart is empty",
      });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setToast({
        type: "error",
        message: "You need to login to complete your purchase",
      });
      // Redirigir a login, recordando que venimos del carrito
      navigate("/login", {
        state: { from: location.pathname || "/cart" },
      });
      return;
    }

    try {
      setIsPlacingOrder(true);

      // 1) Sincronizar carrito local con el backend de Cart
      await syncLocalCartToBackend(items);

      // 2) Crear orden en Orders usando el carrito del usuario autenticado
      const order = await createOrderFromCart();

      const customerName = order.customerName ?? getNameFromToken() ?? "friend";
      const mainItem = order.items[0];

      // 3) Limpiar carrito visual del frontend
      setItems([]);
      setCartItems([]);

      // 4) Navegar a /thanks pasando la info necesaria
      navigate("/thanks", {
        state: {
          orderId: order.id,
          customerName,
          mainProductName: mainItem?.name ?? "your plant",
        },
      });
    } catch (err: any) {
      console.error(err);
      setToast({
        type: "error",
        message: err?.message ?? "Error creating order",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="flex-1 px-16 py-10 flex gap-12">
        <div className="flex-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-slate-700 hover:text-slate-900 mb-4 cursor-pointer"
          >
            <i className="ti ti-chevron-left text-xl" />
          </button>

          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">
              Cart
            </h1>
            <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              {items.length} items
            </span>
          </div>

          <div className="border-t border-slate-200">
            {items.length === 0 ? (
              <div className="py-10 text-slate-500 text-sm">
                Your cart is empty.
              </div>
            ) : (
              items.map((item, index) => (
                <div key={item.id}>
                  <CartItem
                    id={item.id}
                    name={item.name}
                    type={item.type}
                    price={item.price}
                    quantity={item.quantity}
                    imageUrl={item.imageUrl}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                  {index < items.length - 1 && (
                    <hr className="border-slate-200" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="w-80">
          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Price</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-emerald-500 font-semibold">
                  Free
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Coupon Applied</span>
                <span>${coupon.toFixed(2)}</span>
              </div>

              <hr className="my-3 border-slate-200" />

              <div className="flex justify-between text-slate-900 font-semibold">
                <span>TOTAL</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-6 py-3 rounded-lg bg-[#28B446] text-white text-sm font-semibold hover:bg-[#1F9537] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isPlacingOrder || items.length === 0}
              onClick={handleBuyNow}
            >
              {isPlacingOrder ? "Processing..." : "Buy now"}
            </button>
          </div>
        </aside>
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
