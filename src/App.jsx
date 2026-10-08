import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import RegisterPage from './modules/auth/pages/RegisterPage';
import AdminGuard from './modules/shared/components/AdminGuard';

import Home from './modules/home/pages/Home';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import ListOrderPage from './modules/orders/pages/ListOrderPage';

import StoreLayout from './modules/store/pages/StoreLayout';
import StoreProductsPage from './modules/store/pages/StoreProductsPage';
import CartPage from './modules/store/pages/CartPage';
import DetailProduct from './modules/products/pages/DetailProduct';


function App() {
  const router = createBrowserRouter([
    {
  path: '/',
  element: <StoreLayout/>, 
  children: [
    {
      path: '/',
      element: <StoreProductsPage/>,
    },
    {
      path: '/product/:id',
      element: <DetailProduct/>,
    },
    {
      path: '/cart',
      element: <CartPage/>,
    },
  ],
},
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage/>,
    },
    {
      path: '/admin',
      element: (
        <AdminGuard>
          <Dashboard />
        </AdminGuard>
      ),
      children: [
        {
          path: '/admin/home',
          element: <Home />,
        },
        {
          path: '/admin/products',
          element: <ListProductsPage />,
        },
        {
          path: '/admin/products/create',
          element: <CreateProductPage />,
        },
        {
          path: '/admin/orders',
          element: <ListOrderPage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;