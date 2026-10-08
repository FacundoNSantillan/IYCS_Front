import { useState } from "react";
import Button from "../../shared/components/Button";
import { Link } from "react-router-dom";

function StoreProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const increase = () => setQuantity((q) => q + 1);
  const [stockError, setStockError]= useState("");
  const handleAdd = (e) => {
    e.stopPropagation();
    if (quantity > product.stockQuantity) {
      setStockError("No hay suficiente stock disponible.");
      return;
    }
    setStockError("");
    if (quantity < 1) setQuantity(1);
    else onAdd(
  {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price, 
    stockQuantity: product.stockQuantity
  },
    quantity
    );
  };

return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col cursor-pointer transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
      <Link to ={`/product/${product.id}`}>

      <div className="bg-gray-100 aspect-square rounded-lg mb-4 flex items-center justify-center text-gray-300 cursor-pointer">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-16 h-16"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
          />
        </svg>
      </div>
      </Link>

      <div className="mb-4">
        <p className="text-xl text-gray-900 font-medium">{product.name}</p>
        <span className="text-xl text-gray-700 font-bold mb-1">${product.price}</span>
      </div>

      <div className="flex items-center gap-3 mt-auto">
        
        <Button 
            onClick={decrease} 
            variant="secondary"
            className="px-3 py-1 font-bold border border-gray-200"
        >
            -
        </Button>
        
        <span className="font-medium min-w-[1rem] text-center">{quantity}</span>
        
        <Button 
            onClick={increase} 
            variant="secondary"
            disabled={quantity >= product.stockQuantity}
            className={`px-3 py-1 font-bold border border-gray-200
            ${quantity >= product.stockQuantity ? 
            'bg-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-100'}
             `}
        >
            +
        </Button>
        <Button
          onClick={handleAdd}
          className="ml-auto"
        >
          Agregar
        </Button>
        {stockError && <p className="text-sm text-red-600 mt-2">{stockError}</p>}
      </div>
    </div>
  );
}

export default StoreProductCard;