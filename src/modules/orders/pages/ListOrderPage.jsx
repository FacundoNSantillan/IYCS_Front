import { useEffect, useState, useCallback } from 'react';
import Button from '../../shared/components/Button';
import SearchBar from '../../shared/components/SearchBar';
import Card from '../../shared/components/Card';    
import Pagination from '../../shared/components/Pagination';
import { getOrders } from '../services/listServices';
import CustomDropdown from "../../shared/components/CustomDropdown";

const orderStatus = {
  ALL: '',
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

function ListOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const [totalOrders, setTotalOrders] = useState(0); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

const getOrderTotal = (order) => {
    if (!order) return 0;

    if (order.totalAmout !== undefined) return order.totalAmout;
    
    if (order.orderItems && order.orderItems.length > 0) {
        return order.orderItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);
    }

    return 0;
  };

const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrders({
        search: searchTerm,
        status: status === '' ? null : status,
        pageNumber,
        pageSize
      });

      if (error) throw error;

      console.log("Total desde Back:", data.totalCount); 

      setOrders(data.items || []);
      setTotalOrders(data.totalCount || 0);

    } catch (err) {
      console.error(err);
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, status, pageNumber, pageSize]);

useEffect(() => {
    fetchOrders();
}, [fetchOrders]);

  const totalPages = Math.ceil(totalOrders / pageSize) || 1;

const handleSearch = (term) => {
    setSearchTerm(term); 
    setPageNumber(1);   
  };

const filterOptions = [
  { value: orderStatus.ALL, label: "Estado de Orden" },
  { value: orderStatus.PENDING, label: "Pendiente" },
  { value: orderStatus.CONFIRMED, label: "Confirmada" },
  { value: orderStatus.SHIPPED, label: "Enviada" },
  { value: orderStatus.DELIVERED, label: "Entregada" },
  { value: orderStatus.CANCELLED, label: "Cancelada" },
];

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl font-bold text-gray-800'>Ordenes</h1>
        </div>

 <div className='flex flex-col sm:flex-row gap-4'>
  <SearchBar 
    placeholder="Buscar orden..." 
    onSearch={handleSearch} 
  />

  <CustomDropdown 
      value={status}
      options={filterOptions}
      onChange={(val) => { 
          setStatus(val); 
          setPageNumber(1); 
      }}
  />

        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <span>Buscando órdenes...</span>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
              <div>
                <h2 className='text-base sm:text-xl font-bold text-gray-800 break-words'>
                  # {order.id.toString().substring(0, 8)}... - Cliente: {order.customerName || "Cliente Simulado"}
                </h2>
                <p className='text-base sm:text-xl font-bold text-gray-700 mt-1'>
                Estado: <span className="text-purple-700">{order.status}</span>
                </p>
                <div className="flex gap-4 mt-1 text-sm text-gray-500">
                <p>Fecha: {new Date(order.date).toLocaleDateString()}</p>
                <p>Total: ${getOrderTotal(order)}</p>
                </div>
              </div>
              <Button 
              className="mt-3 sm:mt-0" 
              onClick={() => openModal(order)}
              >
              Ver
            </Button>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
             No se encontraron órdenes.
          </div>
        )}
      </div>

      <Pagination 
          currentPage={pageNumber}
          totalPages={totalPages} 
          onPageChange={setPageNumber}
      />

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-2xl font-bold">Detalle de Orden</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">ID Orden</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{new Date(selectedOrder.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-medium">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-green-600 text-lg"> ${getOrderTotal(selectedOrder).toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gray-700">Items de la Orden</h3>
                <div className="bg-gray-50 rounded p-3">
                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedOrder.orderItems.map((item, index) => (
                        <li key={index} className="flex justify-between items-center border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                          <div>
                            <span className="font-medium">Producto ID: {item.productId}</span>
                            <div className="text-sm text-gray-500">Cantidad: {item.quantity} x ${item.unitPrice}</div>
                          </div>
                          <span className="font-bold">${item.subTotal}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No hay items.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-bold mb-1">Dirección de Envío</h3>
                  <p className="text-gray-600">{selectedOrder.shippingAddress || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Dirección de Facturación</h3>
                  <p className="text-gray-600">{selectedOrder.billingAddress || "N/A"}</p>
                </div>
              </div>
              
              {selectedOrder.note && (
                <div className="mt-4 pt-4 border-t">
                   <h3 className="font-bold mb-1">Notas</h3>
                   <p className="text-gray-600 italic">"{selectedOrder.note}"</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={closeModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOrdersPage;