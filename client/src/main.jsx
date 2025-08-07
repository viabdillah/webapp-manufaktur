import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx'; // Jangan lupa import App.jsx
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';


// Impor komponen halaman kita

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductionPage from './pages/ProductionPage.jsx';
import DesignerPage from './pages/DesignerPage.jsx';
import CashierPage from './pages/CashierPage.jsx';
import ManagerPage from './pages/ManagerPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import BlogDetailPage from './pages/BlogDetailPage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import CartPage from './pages/CartPage.jsx';



// Impor CSS utama kita
import './index.css';


// Membuat definisi rute

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 1. App.jsx menjadi elemen utama
    children: [      // 2. Halaman-halaman lain menjadi "anak"-nya
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login', // 4. Path anak tidak perlu diawali '/'
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'blog/:slug', // <-- RUTE BARU DENGAN PARAMETER SLUG
        element: <BlogDetailPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'production',
        element: (
          <ProtectedRoute>
            <ProductionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'design',
        element: (
          <ProtectedRoute>
            <DesignerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cashier',
        element: (
          <ProtectedRoute>
            <CashierPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'manager',
        element: (
          <ProtectedRoute>
            <ManagerPage />
          </ProtectedRoute>
        ),
      },
      {
      path: 'order/:orderId', // <-- RUTE BARU DENGAN PARAMETER
      element: (
        <ProtectedRoute>
          <OrderDetailPage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'shop',
      element: <ShopPage />, // Halaman toko bisa dilihat semua orang
    },
    {
      path: 'cart',
      element: ( // Halaman keranjang hanya untuk yang sudah login
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      ),
    },
    ]
  }
]);

// Merender aplikasi dengan RouterProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>  {/* <-- Bungkus di sini */}
        <RouterProvider router={router} />
      </CartProvider> {/* <-- Dan di sini */}
    </AuthProvider>
  </React.StrictMode>,
);