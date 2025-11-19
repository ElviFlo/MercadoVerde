// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home, {
  Cart,
  Catalogue,
  Login,
  Orders,
  Products,
  Signup,
  Thanks,
} from "./Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/login" element={<Login />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/products" element={<Products />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/thanks" element={<Thanks />} />
    </Routes>
  );
}
