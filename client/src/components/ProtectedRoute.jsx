import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Komponen ini menerima 'children', yaitu komponen lain yang dibungkusnya
function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Jika tidak ada user (belum login), arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  // Jika sudah login, tampilkan komponen yang dibungkusnya
  return children;
}

export default ProtectedRoute;