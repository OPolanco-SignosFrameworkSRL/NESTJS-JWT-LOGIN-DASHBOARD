import { Suspense, lazy, useEffect, useState } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '../layout/AuthLayout';
import Layout from '../layout/Layout';
import Home from '../pages/Home';


const RouterComponent = () => {

  const [isLoading, setIsLoading] = useState(true);


    
  const router = createBrowserRouter([
    {/*
        
        {
          index: true,
          path: '/',
          //element: <LoginPage />,
        },
        {
          path: '/login',
          //element: <LoginPage />,
        },
    */},
    {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            path: '/',
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