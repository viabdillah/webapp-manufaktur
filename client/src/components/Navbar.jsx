import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold hover:text-gray-300">
            Pusat Layanan Kemasan
          </Link>
          <ul className="flex space-x-6 items-center">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            {user ? (
              // Jika pengguna sudah login
              <>
                <li className="font-semibold text-yellow-400">
                  Halo, {user.username}!
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Jika pengguna belum login
              <>
                <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;