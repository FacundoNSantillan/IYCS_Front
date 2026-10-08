import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Pagination from '../../shared/components/Pagination';
import { getProducts } from '../services/list';
import SearchBar from '../../shared/components/SearchBar';
import CustomDropdown from "../../shared/components/CustomDropdown";

const productStatus = {
  ALL: '',
  ENABLED: 'true',
  DISABLED: 'false',
};

function ListProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [totalProducts, setTotalProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await getProducts({ 
        search: searchTerm, 
        isActive: status === '' ? null : status, 
        pageNumber: pageNumber, 
        pageSize: pageSize
      });

      if (error) throw error;

      let fetchedItems = data.items || [];

      if (status === productStatus.ENABLED) {
        fetchedItems = fetchedItems.filter(item => item.isActive === true);
      } else if (status === productStatus.DISABLED) {
        fetchedItems = fetchedItems.filter(item => item.isActive === false);
      }

      setTotalProducts(data.totalCount || 0); 
      setProducts(fetchedItems); 

    } catch (error) {
      console.error(error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  }, [searchTerm, status, pageNumber, pageSize]);

  useEffect(() => { 
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(totalProducts / pageSize) || 1;

  const filterOptions = [
  { value: productStatus.ALL, label: "Todos" },
  { value: productStatus.ENABLED, label: "Habilitados" },
  { value: productStatus.DISABLED, label: "Inhabilitados" },
];

  const handleSearchTrigger = (term) => {
      setSearchParams({ search: term });
      setPageNumber(1);
  }

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-3xl font-bold text-gray-800'>Productos</h1>
          
          <div className="flex gap-2">
            <Button
              className='h-11 w-11 rounded-2xl sm:hidden flex items-center justify-center'
              onClick={() => navigate('/admin/products/create')}
            >
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path> </g></svg>
            </Button>

            <Button
              className='hidden sm:block'
              onClick={() => navigate('/admin/products/create')}
              >
              Crear Producto
            </Button>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
            <SearchBar 
              placeholder="Buscar productos..." 
              onSearch={handleSearchTrigger}
              initialValue={searchTerm} 
            />
            
            <CustomDropdown 
              value={status}
              options={filterOptions}
              onChange={(val) => { setStatus(val); setPageNumber(1); }}
            />
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {
          loading
            ? <div className="text-center py-4 text-gray-500">Buscando datos...</div>
            : products.length > 0 
              ? products.map(product => (
                  <Card key={product.sku}>
                    <h1 className="font-bold text-lg">{product.sku} - {product.name}</h1>
                    <p className='text-base text-gray-600'>Stock: {product.stockQuantity} - <span className="font-semibold text-green-600">${product.price}</span> - {product.isActive ? 'Activado' : 'Desactivado'}</p>
                  </Card>
                ))
              : <div className="text-center py-4 text-gray-400 font-medium">No se encontraron productos.</div>
        }
      </div>

      <Pagination 
        currentPage={pageNumber}
        totalPages={Math.ceil(totalProducts / pageSize) || 1}
        onPageChange={setPageNumber}
      />
    </div>
  );
};

export default ListProductsPage;