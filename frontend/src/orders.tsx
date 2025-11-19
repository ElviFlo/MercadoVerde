import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { ORDERS } from "./data/orders";
import type { Order } from "./data/orders";

const TOTAL_PAGES = 5;

export default function Orders() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page: number) => {
    if (page < 1 || page > TOTAL_PAGES) return;
    setCurrentPage(page);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="flex-1 max-w-7xl px-24 py-10">
        <button type="button" onClick={() => navigate(-1)} className="text-slate-700 hover:text-slate-900 mb-4">
          <i className="ti ti-arrow-left text-xl" />
        </button>

        <div className="flex items-baseline gap-3 mb-10">
          <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
          <span className="text-xs font-semibold tracking-wide text-emerald-500 uppercase">
            {ORDERS.length} items
          </span>
        </div>

        <div className="space-y-6">
          {ORDERS.map((order: Order) => (
            <article key={order.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <i className="ti ti-receipt-2 text-slate-400" />
                    <span className="font-medium">{order.id}</span>
                  </div>

                  <span className="text-slate-300">•</span>

                  <div className="flex items-center gap-2">
                    <i className="ti ti-calendar text-slate-400" />
                    <span>{order.date}</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold uppercase">
                  {order.status}
                </span>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F4F6F8] flex items-center justify-center">
                    <img src={order.mainItem.imageUrl} alt={order.mainItem.name} className="h-12 object-contain"/>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {order.mainItem.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      x{order.mainItem.quantity}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  ${order.mainItem.price.toFixed(2)}
                </p>
              </div>

              <div className="px-6 pb-4 text-center text-xs text-slate-500">
                {order.extraCount > 0 && (
                  <span>
                    +{order.extraCount} <span className="font-semibold">more</span>
                  </span>
                )}
              </div>

              <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Total Payment</span>
                <span className="font-semibold text-slate-800">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Paginación */}
        <div className="mt-10 flex items-center justify-center gap-3 text-xs text-slate-500">
          <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100">
            <i className="ti ti-chevron-left text-[11px]" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button key={page} type="button" onClick={() => goToPage(page)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === TOTAL_PAGES} className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100">
            <i className="ti ti-chevron-right text-[11px]" />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
