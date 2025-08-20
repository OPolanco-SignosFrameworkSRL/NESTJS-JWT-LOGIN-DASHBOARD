import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterComponent from '@/application/router/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './App.css'

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement!);

const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterComponent/>
      <ReactQueryDevtools/>
    </QueryClientProvider>
  </React.StrictMode>
);