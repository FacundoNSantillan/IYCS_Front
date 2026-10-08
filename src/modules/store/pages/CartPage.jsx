import { useState, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Button from '../../shared/components/Button';
import { AuthContext } from '../../auth/context/AuthProvider'; 
import AuthModal from '../../shared/components/AuthModal';
import OrderSuccessModal from '../../shared/components/OrderSuccessModal';
import { createOrder } from '../services/orderService';

function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [purchaseSuccessData, setPurchaseSuccessData] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAdress, setBillingAddress] = useState("");

  const {
    cart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalAmount,
  } = useCart();

  const handleFinalizePurchase = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsLoading(true);

    const orderPayload = {
      shippingAddress: shippingAddress, 
      billingAddress: billingAdress,
      notes: "Compra desde la web",
      orderItems: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
    };

    const result = await createOrder(orderPayload);

    setIsLoading(false);

    if (result.error) {
  const mensajeError = typeof result.error === 'object' 
    ? JSON.stringify(result.error, null, 2) 
    : result.error;

  console.error("Detalle del error:", result.error); 
  alert("Error al procesar la compra: " + mensajeError);
} else {
      setPurchaseSuccessData(result.data);
      clearCart(); 
    }
  };

  const handleCloseSuccessModal = () => {
    setPurchaseSuccessData(null);
    console.log("Redirigiendo a la página de productos...");
    navigate('/');
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
  }

  if (cart.items.length === 0 && !purchaseSuccessData) {
    return (
      <div className="mt-8 text-center text-gray-500">
        Tu carrito está vacío.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 pb-32 lg:pb-8">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative">
        
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          
          <div className="flex justify-between items-center mb-1 px-1">
            <span className="text-gray-600 text-sm font-medium">{totalItems} productos</span>
            
            <Button 
              onClick={clearCart}
              variant="danger"
              className="px-3 py-1 h-8 text-xs sm:text-sm"
            >
              Vaciar
            </Button>
          </div>

          <div className="space-y-3">
            {cart.items.map(item => (
              <div
                key={item.productId}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex flex-row items-start gap-3 sm:gap-6 relative"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0 text-gray-300 self-center sm:self-start">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-lg text-gray-900 truncate leading-tight">{item.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    </div>
                    <p className="text-purple-700 font-bold text-sm sm:text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    
                    <div className="text-xs text-gray-400 hidden sm:block">
                      ${item.price} c/u
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">

                       <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            variant="secondary"
                            className="px-3 h-8 py-0 font-bold border border-gray-200"
                          >
                            –
                          </Button>
                          
                          <span className="w-6 text-center text-sm font-semibold text-gray-700">
                             {item.quantity}
                          </span>

                          <Button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)} 
                            variant="secondary"
                            disabled={item.quantity >= item.stockQuantity}
                            className={`px-3 h-8 py-0 font-bold border border-gray-200
                            ${item.quantity >= item.stockQuantity ? 
                            'bg-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-100'}
                            `}
                                  >
                                      +
                                  </Button>
                       </div>

                       <Button
                        onClick={() => removeItem(item.productId)}
                        variant="danger"
                        className="px-3 h-8 py-0 text-xs"
                       >
                          Eliminar
                       </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="
            fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.1)]
            lg:static lg:col-span-1 lg:bg-transparent lg:border-0 lg:shadow-none lg:z-auto
        ">
          <div className="p-4 lg:p-6 lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-100 lg:sticky lg:top-4">
            
            <h2 className="hidden lg:block text-xl font-bold text-gray-900 mb-6">Resumen</h2>
            
            <div className="flex flex-row lg:flex-col justify-between items-center lg:items-stretch gap-4">
              
              <div className="flex flex-col lg:gap-4 flex-1">
                 <div className="hidden lg:flex justify-between text-gray-600">
                   <span>Cantidad:</span>
                   <span>{totalItems}</span>
                 </div>
                 <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end lg:pt-4 lg:border-t">
                    <span className="text-xs text-gray-500 lg:text-base lg:text-gray-800 lg:font-bold">Total a pagar:</span>
                    <span className="text-xl lg:text-2xl font-bold text-gray-900 leading-none lg:leading-normal">
                      ${totalAmount.toFixed(2)}
                    </span>
                 </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Dirección de envío"
                  value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Dirección de facturación"
                  value={billingAdress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>

              <Button
                type="button"
                onClick={handleFinalizePurchase}
                disabled={isLoading} 
                className={`w-full lg:w-auto h-auto py-3 text-base lg:text-lg shadow-md ${
                  isLoading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-purple-200 text-purple-900 hover:bg-purple-300'
                }`}
              >
                {isLoading ? 'Procesando...' : 'Finalizar Compra'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />

      <OrderSuccessModal 
        isOpen={!!purchaseSuccessData}
        onClose={handleCloseSuccessModal}
        orderDetails={purchaseSuccessData}
      />
    </div>
  );
}

export default CartPage;