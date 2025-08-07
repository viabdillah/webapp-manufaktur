import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Jika masih dalam proses loading, tampilkan pesan loading
  if (loading) {
    return <div className="text-center mt-20">Memeriksa autentikasi...</div>;
  }

  // Jika sudah tidak loading DAN tidak ada user, baru redirect
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Jika sudah tidak loading DAN ada user, tampilkan halaman
  return children;
}

export default ProtectedRoute;