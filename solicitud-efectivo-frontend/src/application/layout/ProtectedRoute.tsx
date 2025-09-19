import { Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';

export const ProtectedRoute = () => {

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace={true} />;
  } else {
    return <Layout />;
  }
  
};