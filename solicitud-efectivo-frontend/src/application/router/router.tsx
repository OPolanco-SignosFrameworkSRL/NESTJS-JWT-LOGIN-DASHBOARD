import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SolicitudGastos from '../pages/SolicitudGastos';
import CreateEmployee from '../pages/admin/employees/CreateEmployee';
import NewRequest from '../pages/request/NewRequest';
import Disbursement from '../pages/Disbursement';
import { ProtectedRoute } from '@/application/layout/ProtectedRoute';
import EditEmployee from '../pages/admin/employees/EditEmployee';
import Admin from '../pages/admin/Admin';
import PaymentSettle from '../pages/PaymentSettle';
import EmployeeTable from "@/application/pages/admin/employees/EmployeeTable"
import RolesTable from '../pages/admin/roles/RolesTable';
import RolePermissionsTable from '../pages/admin/rolePermissions/RolePermissionsTable';
import Dashboard from '../pages/admin/dashboard/Dashboard';
import { Facilities } from '../pages/configuration/Facilities';

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
          path: '/admin/facilities',
          element: <Facilities/>
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
            },
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