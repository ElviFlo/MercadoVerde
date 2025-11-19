import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center border-b-2 border-[#D1D2D4] py-4 px-6">
      {/* Logo */}
      <Link to="/">
        <img src="/logo.png" alt="Mercado Verde Logo" className="w-36" />
      </Link>

      {/* Sections */}
      <div className="flex gap-14">
        <Link to="/catalogue">Catalogue</Link>
        {/*<Link to="/thanks" className="">Thanks</Link>*/}
        <span className="cursor-pointer">About us</span>
        <span className="cursor-pointer">Contact us</span>
      </div>

      {/* User and Cart */}
      <div className="flex gap-5 mr-2 items-center">
        <div className="relative">
          <button type="button" onClick={() => setIsUserMenuOpen((prev) => !prev)} className="rounded-full p-1">
            <i className="ti ti-user text-3xl"></i>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg text-sm z-20">
              <Link to="/login" className="block px-4 py-2" onClick={() => setIsUserMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="block px-4 py-2" onClick={() => setIsUserMenuOpen(false)}>
                Signup
              </Link>
              <Link to="/orders" className="block px-4 py-2" onClick={() => setIsUserMenuOpen(false)}>
                Orders
              </Link>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart">
          <i className="ti ti-shopping-cart text-3xl"></i>
        </Link>
      </div>
    </header>
  );
}
