import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../store/services/products";
import { useCart } from "../../store/hooks/useCart";
import Toast from "../../shared/components/Toast";
import { useNavigate } from "react-router-dom";

function DetailProduct() {
const { id } = useParams();
const [product, setProduct] = useState([]);
const [loading, setLoading] = useState(true);
const { addItem } = useCart();
const navigate = useNavigate();
const [showToast, setShowToast] = useState(false);

const handleAddToCart = (product, quantity) => {
    addItem(product, quantity);
    setShowToast(true);
    setTimeout(() => {
        setShowToast(false);
    }, 3000);
};
const handleBuyNow = () => {
    addItem(product, 1),
    navigate("/cart");
};

useEffect(() => {
    const fetchProduct = async () => {
    try {
        const data = await getProductById(id);
        setProduct(data);
    } catch (error) {
        console.error("Error al cargar producto:", error);
    } finally {
        setLoading(false);
    }
    };

    fetchProduct();
}, [id]);

if (loading) {
    return <p className="text-center mt-10">Cargando producto...</p>;
}

if (!product) {
    return <p className="text-center mt-10">Producto no encontrado</p>;
}

return (
    <Toast
    message={"Producto agregado al carrito"}
    show={showToast}
    />
    ,
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 rounded-xl shadow-sm">

    <div className="flex justify-center items-center bg-white rounded-xl p-6 shadow">
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

    <div className="flex flex-col gap-4">

        <h1 className="text-3xl font-bold text-gray-800">
        {product.name}
        </h1>


        <p className="text-2xl font-semibold text-green-600">
        ${product.price}
        </p>

        <p className="text-sm text-gray-600">
        Stock disponible:{" "}
        <span className={product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}>
            {product.stockQuantity}
        </span>
        </p>

        <hr />

        <p className="text-gray-700">
        {product.description}
        </p>

        <div className="flex flex-col gap-3 mt-6">
        <button
        onClick={handleBuyNow}
        className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Comprar ahora
        </button>

        </div>

    </div>
    </div>
);
}

export default DetailProduct;