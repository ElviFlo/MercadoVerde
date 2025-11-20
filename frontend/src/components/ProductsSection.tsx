import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

type HomeProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

const HOME_PRODUCTS: HomeProduct[] = [
  { id: 1, name: "Fiddle Leaf Fig", price: 120, imageUrl: "/plants/plant.png" },
  { id: 2, name: "Rubber Plant", price: 80, imageUrl: "/plants/plant.png" },
  { id: 3, name: "Areca Palm", price: 150, imageUrl: "/plants/plant.png" },
  { id: 4, name: "Mini Ficus", price: 95, imageUrl: "/plants/plant.png" },
  { id: 5, name: "Peace Lily", price: 60, imageUrl: "/plants/plant.png" },
  { id: 6, name: "Snake Plant", price: 70, imageUrl: "/plants/plant.png" },
  { id: 7, name: "Outdoor Boxwood", price: 180, imageUrl: "/plants/plant.png" },
  { id: 8, name: "Succulent Mix", price: 40, imageUrl: "/plants/plant.png" },
  { id: 9, name: "Hanging Ivy", price: 55, imageUrl: "/plants/plant.png" },
  { id: 10, name: "Cactus Trio", price: 35, imageUrl: "/plants/plant.png" },
  { id: 11, name: "Outdoor Fern", price: 90, imageUrl: "/plants/plant.png" },
  { id: 12, name: "ZZ Plant", price: 110, imageUrl: "/plants/plant.png" },
];

export default function ProductsSection() {
  return (
    <section className="w-full py-16 bg-white">
      {/* Título */}
      <div className="text-center mb-10">
        <h2 className="text-5xl text-slate-900 mb-2">
          Products
        </h2>
        <p className="text-sm text-slate-500">
          Order it for you or for your beloved ones
        </p>
      </div>

      {/* Grid de productos */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {HOME_PRODUCTS.map((product) => (
            <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} imageUrl={product.imageUrl}/>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/catalogue" className="inline-flex items-center gap-2 text-[#026910] font-semibold hover:text-[#329940] transition-colors duration-200">
            <span>Ver más</span>
            <i className="ti ti-chevron-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
