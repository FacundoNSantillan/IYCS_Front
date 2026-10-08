import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import StoreProductCard from '../components/StoreProductCard';
import { getPublicProducts } from '../services/products';
import { useCart } from '../hooks/useCart';
import Toast from '../../shared/components/Toast';
import { Link } from 'react-router-dom';

function StoreProductsPage() {
  const { addItem } = useCart();

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || ''; 
  const [showToast, setShowToast] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await getPublicProducts({
        search: searchTerm || null,
        pageNumber,
        pageSize,
      });
      if (error) throw error;

      setTotal(data.totalCount || 0);
      setProducts(data.items || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageNumber, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product, quantity) => {
      addItem(product, quantity);
      setShowToast(true);
      setTimeout(() => {
          setShowToast(false);
      }, 3000);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
   <div className="space-y-4">      

   <Toast 
         message="Producto Agregado al Carrito" 
         show={showToast} 
      />

      {searchTerm && (
        <h2 className="text-xl font-semibold text-gray-800">
          Resultados para: "{searchTerm}"
        </h2>
      )}

      {loading ? (
        <div className="mt-10 text-center text-gray-500">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="mt-10 text-center text-gray-500 bg-white p-8 rounded-xl shadow-sm">
           <p className="text-lg">No se encontraron productos.</p>
           {searchTerm && <p className="text-sm mt-2">Intenta con otra palabra clave.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="cursor-pointer">
              <StoreProductCard
              key={product.id}
              product={product}
              onAdd={handleAddToCart}
              />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <button
            type="button"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            className={`px-3 py-1.5 rounded-full border ${
              pageNumber === 1
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Anterior
          </button>
          <span className="text-gray-500">
            Página {pageNumber} de {totalPages}
          </span>
          <button
            type="button"
            disabled={pageNumber === totalPages}
            onClick={() =>
              setPageNumber(p => (p < totalPages ? p + 1 : p))
            }
            className={`px-3 py-1.5 rounded-full border ${
              pageNumber === totalPages
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default StoreProductsPage;