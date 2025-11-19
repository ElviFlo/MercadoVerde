import { Link } from "react-router-dom";

type ProductCardProps = { id: number; name: string; price: number; imageUrl: string; };

export default function ProductCard({ id, name, price, imageUrl }: ProductCardProps) {
  return (
    <Link to={`/product/${id}`} className="block group">
      <article className="bg-[#F4F6F8] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="h-40 flex items-center justify-center">
          <img src={imageUrl} alt={name} className="h-36 object-contain"/>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 truncate">
            {name}
          </span>
          <span className="text-sm font-semibold text-[#04D721]">
            ${price.toFixed(2)}
          </span>
        </div>
      </article>
    </Link>
  );
}
