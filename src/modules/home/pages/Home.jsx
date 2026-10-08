import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getProducts } from '../../products/services/list';
import { getOrders } from '../../orders/services/listServices';

function Home() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [productsRes, ordersRes] = await Promise.all([
        getProducts({
        search: null,
        status: null,
        pageNumber: 1,
        pageSize: 1
      }),
      getOrders({
        search: null,
        status: null,
        pageNumber: 1,
        pageSize: 1
      })
    ]);

        setStats({
          products: productsRes.data?.totalCount || 0,
          orders: ordersRes.data?.totalCount || 0
        });
      } catch (error) {
        console.error("❌ Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className='flex flex-col gap-6 p-4'>
      <h2 className='text-2xl font-bold text-gray-800 border-b pb-4'>Principal</h2>

      <div className='flex flex-col gap-4'>
        <Card className="flex flex-col p-6 shadow-sm border border-gray-200 bg-white rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Productos</h3>
          <div className="text-gray-600 text-lg">
            Cantidad de Productos: <span className="font-bold text-gray-900 ml-2">{loading ? "..." : stats.products}</span>
          </div>
        </Card>

        <Card className="flex flex-col p-6 shadow-sm border border-gray-200 bg-white rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ordenes</h3>
          <div className="text-gray-600 text-lg">
            Cantidad de Ordenes: <span className="font-bold text-gray-900 ml-2">{loading ? "..." : stats.orders}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;