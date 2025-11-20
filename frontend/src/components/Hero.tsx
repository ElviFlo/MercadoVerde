import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[880px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
      <div className="absolute inset-0 bg-white/40" />

      {/* Card central */}
      <div className="relative max-w-2xl bg-white/80 rounded-2xl shadow-lg px-10 py-12 text-center flex flex-col items-center">
        {/* Icono de plantita */}
        <div className="mb-4 text-3xl">
          <i className="ti ti-seedling text-6xl text-[#039E18]"></i>
        </div>

        <h1 className="text-4xl font-semibold text-slate-900 mb-4">
          The Nature Plant
        </h1>

        <p className="text-base text-slate-700 leading-relaxed max-w-2xl mb-8">
          All grown with love and care, The Nature Plant brings a touch of
          freshness and life to every corner of your home.
        </p>

        <Link to="/catalogue" className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#53D15E] text-white font-semibold text-base shadow hover:bg-[#33B13E] transition-colors duration-200">
          Discover our products
        </Link>
      </div>
    </section>
  );
}
