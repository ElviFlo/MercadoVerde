import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="flex justify-between items-center border-b-2 border-[#D1D2D4] py-4 px-6">

      {/* Logo */}
      <img src="/logo.png" alt="Mercado Verde Logo" className="w-36" />

      {/* Sections */}
      <div className="flex gap-14">
        <a href="" className="">Catalogue</a>
        <span className="cursor-pointer">About us</span>
        <span className="cursor-pointer">Contact us</span>
      </div>

      {/* Login and Cart */}
      <div className="flex gap-5 mr-2">
        <Link to="/login"><i className="ti ti-user text-3xl"></i></Link>
        <a href="/cart" className=""><i className="ti ti-shopping-cart text-3xl"></i></a>
      </div>
    </header>
  )
}
