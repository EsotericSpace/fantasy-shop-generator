import React from 'react';
import ReactDOM from 'react-dom/client';
import ShopkeeperApp from './ShopkeeperApp';
import './index.css'; // Tailwind entry point

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ShopkeeperApp />
  </React.StrictMode>
);
