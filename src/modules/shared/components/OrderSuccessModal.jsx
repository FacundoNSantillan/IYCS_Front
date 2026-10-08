import React from 'react';
import Button from './Button'; 

const OrderSuccessModal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen || !orderDetails) return null;

  const formattedDate = new Date(orderDetails.date).toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        <div className="bg-green-50 p-6 text-center border-b border-green-100">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">¡Compra Exitosa!</h3>
          <p className="mt-2 text-sm text-gray-500">
            Gracias por tu compra, <span className="font-bold">{orderDetails.customerName}</span>.
          </p>
        </div>

        <div className="px-6 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">N° Orden:</span>
            <span className="font-mono font-bold text-gray-700">#{orderDetails.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fecha:</span>
            <span className="text-gray-700">{formattedDate}</span>
          </div>
          
          <div className="border-t border-gray-100 my-2 pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Productos</p>
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {(orderDetails.orderItems || [])?.map((item) => (
                <li key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate w-2/3">
                  {item.productName} 
                  <span className="text-xs ml-1">(x{item.quantity})</span>
                  </span>
                  <span className="font-medium text-gray-900">${item.subTotal.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">Total Pagado</span>
            <span className="text-xl font-bold text-purple-600">${(orderDetails.totalAmount || orderDetails.totalAmout || 0)?.toFixed(2)}</span> {/*EN LO POSIBLE CORREGIR EN EL BACK O FRONT SI ES AMOUNT O AMOUT*/}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <Button 
            onClick={onClose} 
            className="w-full justify-center bg-purple-600 hover:bg-purple-700 text-white"
          >
            Volver a la Tienda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;