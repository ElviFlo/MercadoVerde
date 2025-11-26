import { Routes, Route } from "react-router-dom";
import Home, { Cart, Catalogue, Login, Orders, Product, Signup, Thanks } from "./Home";
import Kora from "./components/Kora";

export default function App() {
  return (
    <div>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/login" element={<Login />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/thanks" element={<Thanks />} />
    </Routes>
      <Kora />
    </div>
  );
}
