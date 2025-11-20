import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartItem from "./components/cartItem";

type CartItemData = {
  id: number;
  name: string;
  type: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

const INITIAL_CART: CartItemData[] = [
  {
    id: 1,
    name: "Snake Plant",
    type: "Indoor",
    price: 149.99,
    quantity: 1,
    imageUrl: "/plants/plant.png",
  },
  {
    id: 2,
    name: "Boston Fern",
    type: "Air-Purifying",
    price: 169.99,
    quantity: 1,
    imageUrl: "/plants/plant.png",
  },
];

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItemData[]>(INITIAL_CART);

  const handleQuantityChange = (id: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const coupon = 0;
  const total = subtotal + shipping - coupon;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="flex-1 px-16 py-10 flex gap-12">
        <div className="flex-1">
          <button type="button" onClick={() => navigate(-1)} className="text-slate-700 hover:text-slate-900 mb-4 cursor-pointer">
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

            <button type="button" className="w-full mt-6 py-3 rounded-lg bg-[#28B446] text-white text-sm font-semibold hover:bg-[#1F9537] transition-colors"
              onClick={() => {
                console.log("Buy now clicked");
              }}>
              Buy now
            </button>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
