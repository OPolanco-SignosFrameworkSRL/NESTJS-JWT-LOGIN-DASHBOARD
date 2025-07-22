import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterComponent from '@/application/router/router';

import './App.css'

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <RouterComponent/>
  </React.StrictMode>
);