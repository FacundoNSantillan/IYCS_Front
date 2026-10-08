import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthProvider';
import { jwtDecode } from "jwt-decode"; 

const AdminGuard = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem('token'); 

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />; 
  }

  try {
    const decoded = jwtDecode(token);

    const userRole = decoded.role || 
                     decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                     decoded.tipo_usuario;

    if (userRole !== 'Admin') {
      return <Navigate to="/" replace />;
    }

  } catch (error) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminGuard;