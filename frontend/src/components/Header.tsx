import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Cerrar cuando se hace click fuera del menú
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center border-b-2 border-[#D1D2D4] py-4 px-6">
      {/* Logo */}
      <Link to="/">
        <img src="/logo.png" alt="Mercado Verde Logo" className="w-36" />
      </Link>

      {/* Sections */}
      <div className="flex gap-14">
        <Link
          to="/catalogue"
          className="hover:text-[#555] transition-colors duration-200"
        >
          Catalogue
        </Link>
        {/*<Link to="/thanks" className="">Thanks</Link>*/}
        <span className="cursor-pointer hover:text-[#555] transition-colors duration-200">
          About us
        </span>
        <span className="cursor-pointer hover:text-[#555] transition-colors duration-200">
          Contact us
        </span>
      </div>

      {/* User and Cart */}
      <div className="flex gap-5 mr-2 items-center">
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="rounded-full p-1 cursor-pointer hover:text-[#555] transition-colors duration-200"
          >
            <i className="ti ti-user text-3xl"></i>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg text-sm z-20">
              <Link
                to="/orders"
                className="block px-4 py-2 hover:bg-[#EEE] rounded-t-xl"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-[#EEE]"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 hover:bg-[#EEE] rounded-b-xl"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Sign Up
              </Link>
              {/* FALTA OPCION DE EXIT */}
            </div>
          )}
        </div>

        {/* Cart */}
        <Link
          to="/cart"
          className="hover:text-[#555] transition-colors duration-200"
        >
          <i className="ti ti-shopping-cart text-3xl"></i>
        </Link>
      </div>
    </header>
  );
}
