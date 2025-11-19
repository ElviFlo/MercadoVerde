import { Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Thanks() {
  return (
    <main className="flex flex-col justify-between">
      <Header />
      <div className="flex flex-col justify-center items-center text-center max-w-2xl mx-auto p-20">
        {/* Green circle with check */}
        <div className="flex items-center justify-center w-28 h-28 rounded-full border-[6px] border-emerald-400 mb-6">
          <span className="text-5xl text-emerald-400">✓</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">
          Payment Confirmed
        </h1>

        {/* Order number */}
        <p className="text-sm font-semibold text-emerald-500 tracking-wide mb-6">
          ORDER #NUMBER
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-8">
          Thank you NAME for buying PRODUCT. The nature is grateful to you. Now
          that your order is confirmed it will be ready to ship in 2 days.
          Please check your inbox in the future for your order updates.
        </p>

        {/* Button */}
        <Link to="/" className="px-10 py-3 rounded-md bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition-colors">
          Back to Homepage
        </Link>
      </div>
      <Footer />
    </main>
  );
}
