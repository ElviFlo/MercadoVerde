type CartItemProps = {
  id: number;
  name: string;
  type: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
};

export default function CartItem({
  id,
  name,
  type,
  price,
  quantity,
  imageUrl,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const handleDecrease = () => {
    if (quantity > 1) onQuantityChange(id, quantity - 1);
  };

  const handleIncrease = () => {
    onQuantityChange(id, quantity + 1);
  };

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-[#F4F6F8] flex items-center justify-center">
          <img
            src={imageUrl}
            alt={name}
            className="h-20 object-contain"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-slate-900">
            {name}
          </p>
          <div className="text-xs text-slate-400">
            <span>Type&nbsp;</span>
            <span className="font-semibold text-slate-700">{type}</span>
          </div>

          {/* controles cantidad + eliminar */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center border border-slate-200 rounded-lg px-4 py-2 gap-6">
              <button
                type="button"
                onClick={handleDecrease}
                className="text-lg text-slate-700 hover:text-slate-900"
              >
                <i className="ti ti-minus" />
              </button>
              <span className="text-sm font-medium text-slate-800 min-w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                className="text-lg text-slate-700 hover:text-slate-900"
              >
                <i className="ti ti-plus" />
              </button>
            </div>

            <button type="button" onClick={() => onRemove(id)} className="text-slate-500 cursor-pointer">
              <i className="ti ti-trash text-xl" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-base font-semibold text-slate-900">
        ${price.toFixed(2)}
      </p>
    </div>
  );
}
