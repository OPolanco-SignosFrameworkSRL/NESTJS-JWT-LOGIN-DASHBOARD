import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SolicitudGastos from '../pages/SolicitudGastos';
import CreateEmployee from '../pages/Admin/employees/CreateEmployee';
import NewRequest from '../pages/request/NewRequest';
import Disbursement from '../pages/Disbursement';
import { ProtectedRoute } from '@/application/layout/ProtectedRoute';
import EditEmployee from '../pages/Admin/employees/EditEmployee';
import Admin from '../pages/Admin/Admin';
import PaymentSettle from '../pages/PaymentSettle';
import EmployeeTable from "@/application/pages/Admin/employees/EmployeeTable"
import RolesTable from '../pages/Admin/roles/RolesTable';
import RolePermissionsTable from '../pages/Admin/rolePermissions/RolePermissionsTable';
import Dashboard from '../pages/Admin/dashboard/Dashboard';


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
        },
        {
          path: '/edit-employee',
          element: <EditEmployee/>
        },
        {
          path: '/payment-settle',
          element: <PaymentSettle/>
        },
        {
          path: '/admin',
          element: <Admin/>,
          children: [
            {
              path: '/admin',
              element: <Dashboard/>
            },
            {
              path: '/admin/employees',
              element: <EmployeeTable/>
            },
            {
              path: '/admin/roles',
              element: <RolesTable/>
            },
            {
              path: '/admin/permissions',
              element: <RolePermissionsTable/>
            }
          ]
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

{/*


  
  
*/}