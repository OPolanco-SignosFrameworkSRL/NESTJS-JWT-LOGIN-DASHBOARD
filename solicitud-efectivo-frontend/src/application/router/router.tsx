import { Suspense, lazy, useEffect, useState } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '../layout/AuthLayout';
import Layout from '../layout/Layout';
import Home from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';


const RouterComponent = () => {

  const [isLoading, setIsLoading] = useState(true);
    
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
      element: <Layout />,
      children: [
        {
          index: true,
          path: '/home',
          element: <Home />,
        },
      ],
    },
    {/*

        {
          path: '/',
          element: <ProtectedRoute />,
          children: [
            
          ],
        },

    */}
  ]);

  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default RouterComponent;