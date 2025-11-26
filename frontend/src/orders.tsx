// src/orders.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getMyOrders, type OrderDTO } from "./api/orders";

export default function Orders() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const PAGE_SIZE = 5;

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getMyOrders();
        setOrders(data);
      } catch (err: any) {
        console.error(err);
        setToast({
          type: "error",
          message: err?.message ?? "Error loading orders",
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="flex-1 max-w-7xl px-24 py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-slate-700 hover:text-slate-900 mb-4"
        >
          <i className="ti ti-arrow-left text-xl" />
        </button>

        <div className="flex items-baseline gap-3 mb-10">
          <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
          <span className="text-xs font-semibold tracking-wide text-emerald-500 uppercase">
            {orders.length} items
          </span>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-slate-500">
            You don&apos;t have any orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {paginatedOrders.map((order) => {
              const mainItem = order.items[0];
              const extraCount = Math.max(order.items.length - 1, 0);

              // 🔹 Intentamos varias fuentes para la imagen del producto
              const mainImageUrl =
                (mainItem as any)?.imageUrl ??
                (mainItem as any)?.product?.imageUrl ??
                "/plants/plant-1.png";

              return (
                <article
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Header de la tarjeta */}
                  <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <i className="ti ti-receipt-2 text-slate-400" />
                        <span className="font-medium">{order.id}</span>
                      </div>

                      <span className="text-slate-300">•</span>

                      <div className="flex items-center gap-2">
                        <i className="ti ti-calendar text-slate-400" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* 🔹 Chip verde arriba a la derecha: siempre muestra "Paid" */}
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold uppercase">
                      Paid
                    </span>
                  </div>

                  {/* Contenido principal de la orden */}
                  {mainItem && (
                    <>
                      <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-[#F4F6F8] flex items-center justify-center overflow-hidden">
                            <img
                              src={mainImageUrl}
                              alt={mainItem.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {mainItem.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              x{mainItem.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-slate-800">
                          $
                          {(
                            Number(mainItem.unitPrice) * mainItem.quantity
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div className="px-6 pb-4 text-center text-xs text-slate-500">
                        {extraCount > 0 && (
                          <span>
                            +{extraCount}{" "}
                            <span className="font-semibold">more</span>
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Footer con total */}
                  <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Total Payment</span>
                    <span className="font-semibold text-slate-800">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {orders.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-3 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <i className="ti ti-chevron-left text-[11px]" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
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

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <i className="ti ti-chevron-right text-[11px]" />
            </button>
          </div>
        )}
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
