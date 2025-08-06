import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx'; // Jangan lupa import App.jsx
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Impor komponen halaman kita

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';


// Impor CSS utama kita
import './index.css';


// Membuat definisi rute

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 1. App.jsx menjadi elemen utama
    children: [      // 2. Halaman-halaman lain menjadi "anak"-nya
      {
        index: true, // 3. HomePage menjadi halaman default untuk path '/'
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
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
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
      <RouterProvider router={router} />
    </AuthProvider> 
  </React.StrictMode>,
);