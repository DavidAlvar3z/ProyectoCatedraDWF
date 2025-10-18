// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/UserContext'; // Solo uno
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Estilos globales
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UserProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </UserProvider>
  </React.StrictMode>
);