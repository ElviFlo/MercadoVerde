import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

type UserInfo = {
  name: string;
  isAdmin: boolean;
};

// Helper para leer info básica del JWT
function getUserInfoFromToken(): UserInfo | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;

    const decoded = JSON.parse(atob(payloadBase64));

    const name =
      decoded.name ??
      decoded.username ??
      decoded.email ??
      "Logged user";

    const isAdmin =
      decoded.role === "ADMIN" ||
      decoded.role === "admin" ||
      decoded.isAdmin === true;

    return { name, isAdmin };
  } catch {
    return null;
  }
}

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const isLogged = Boolean(localStorage.getItem("accessToken"));
  const userInfo = isLogged ? getUserInfoFromToken() : null;

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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center border-b-2 border-[#D1D2D4] py-4 px-6">
      {/* Logo */}
      <Link to="/">
        <img
          src="/logo.png"
          alt="Mercado Verde Logo"
          className="w-36"
        />
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
            <i
              className={
                isLogged
                  ? "ti ti-user-filled text-3xl"
                  : "ti ti-user text-3xl"
              }
            ></i>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg text-sm z-20">
              {/* Bloque con el usuario logueado */}
              {isLogged && userInfo && (
                <>
                  <div className="px-4 py-2 text-xs text-slate-500">
                    <span className="block text-[11px] tracking-wide">
                      Logged as
                    </span>
                    <span className="block text-sm font-semibold text-slate-900">
                      {userInfo.name}
                    </span>
                    <span className="block text-[11px] text-emerald-600 mt-0.5">
                      {userInfo.isAdmin ? "Administrator" : ""}
                    </span>
                  </div>
                  {/* Separador delgado */}
                  <div className="border-t border-slate-200 mt-1" />
                </>
              )}

              {/* Si no está logueado podrías mostrar algo tipo "Guest", opcional */}
              {!isLogged && (
                <>
                  <div className="px-4 py-2 text-xs text-slate-500">
                    <span className="block text-[11px] uppercase tracking-wide">
                      Not logged in
                    </span>
                    <span className="block text-sm text-slate-800">
                      Guest user
                    </span>
                  </div>
                  <div className="border-t border-slate-200 my-1" />
                </>
              )}

              <Link
                to="/orders"
                className="block px-4 py-2 hover:bg-[#EEE]"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Orders
              </Link>

              {!isLogged && (
                <>
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
                </>
              )}

              {isLogged && (
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 hover:bg-[#EEE] text-red-600 rounded-b-xl"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              )}
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
