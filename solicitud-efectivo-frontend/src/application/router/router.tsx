import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import { ProtectedRoute } from '../layout/AuthLayout';

import Home from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SolicitudGastos from '../pages/SolicitudGastos';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import CreateEmployee from '../pages/Admin/CreateEmployee';
import NewRequest from '../pages/Request/NewRequest';
import Disbursement from '../pages/Disbursement';
import { ProtectedRoute } from '@/application/layout/ProtectedRoute';


const RouterComponent = () => {

  //const [isLoading, setIsLoading] = useState(true);
    
  const router = createBrowserRouter([

    {
      index: true,
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/home',
          element: <Home />,
        },
        {
          path: '/solicitud-gastos',
          element: <SolicitudGastos/>
        },
        {
          path: '/admin-dashboard',
          element: <AdminDashboard/>
        },
        {
          path: '/create-employee',
          element: <CreateEmployee/>
        },
        {
          path: '/new-request',
          element: <NewRequest/>
        },
        {
          path: '/disbursement',
          element: <Disbursement/>
        }
      ],
    },

  ]);

  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default RouterComponent;