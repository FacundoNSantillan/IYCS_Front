import { useState, useContext } from "react";
import { Outlet, Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from '../../shared/components/SearchBar';
import Button from '../../shared/components/Button';
import AuthModal from "../../shared/components/AuthModal";
import Toast from '../../shared/components/Toast';
import { useCart } from '../../store/hooks/useCart';
import { AuthContext } from '../../auth/context/AuthProvider';

function StoreLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const { showNotification } = useCart();

  const initialSearchTerm = searchParams.get('search') || '';
  const { isAuthenticated, singout } = useContext(AuthContext);

  const handleSearch = (term) => {
    navigate(`/?search=${term}`);
    setOpen(false); 
  };

  const openLogin = () => {
    setAuthView('login');
    setAuthModalOpen(true);
    setOpen(false);
  };

  const openRegister = () => {
    setAuthView('register');
    setAuthModalOpen(true);
    setOpen(false);
  };

  const handleLogout = () => {
      singout();
      setOpen(false); 
  };
  
return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative"> 

      <Toast 
         message="¡Agregaste un producto al carrito!" 
         show={showNotification} 
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialView={authView}
      />

      <header className="bg-white shadow-sm sticky top-0 z-40"> 
        <div className="px-4 py-3 flex justify-between items-center gap-4">
            
            <div className="flex items-center gap-6 flex-shrink-0">
                <Link to="/" className="flex items-center justify-center text-purple-600 bg-purple-50 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" /></svg>
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                  <Link to="/" className="font-medium text-gray-700 hover:text-purple-600 transition-colors">Productos</Link>
                  <Link to="/cart" className="font-medium text-gray-700 hover:text-purple-600 transition-colors whitespace-nowrap">Carrito</Link>
                </div>
            </div>

            <div className="hidden sm:flex flex-1 max-w-2xl px-8">
              <SearchBar placeholder="Buscar productos..." onSearch={handleSearch} initialValue={initialSearchTerm} className="w-full" />
            </div>

            <div className="flex items-center gap-3">
              
              <div className="hidden sm:flex gap-3 items-center">
                {isAuthenticated ? (
                    <Button 
                        variant="danger" 
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </Button>
                ) : (
                    <>
                        <Button 
                            variant="secondary" 
                            onClick={openLogin}
                        >
                            Iniciar Sesión
                        </Button>
                        
                        <Button 
                            onClick={openRegister}
                        >
                            Registrarse
                        </Button>
                    </>
                )}
              </div>

              <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors" onClick={() => setOpen(!open)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              </button>
            </div>
        </div>
        <div className="sm:hidden px-4 pb-4 pt-1 bg-white border-t border-gray-50 block">
             <SearchBar placeholder="Buscar productos..." onSearch={handleSearch} initialValue={initialSearchTerm} className="w-full" />
        </div>
      </header>

      {open && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-2 fixed w-full z-30 shadow-xl">
          <Link to="/" onClick={() => setOpen(false)} className="text-lg py-3 border-b border-gray-50 font-medium text-gray-800">Productos</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="text-lg py-3 border-b border-gray-50 font-medium text-gray-800">Carrito de Compras</Link>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button variant="secondary" className="w-full h-12 text-base" onClick={openLogin}>
                Iniciar Sesión
            </Button>
            
            <Button className="w-full h-12 text-base" onClick={openRegister}>
                Registrarse
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <Outlet />
      </div>

    </div>
  );
}

export default StoreLayout;