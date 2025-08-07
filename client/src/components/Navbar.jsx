import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // <-- 1. Impor CartContext

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext); // <-- 2. Ambil data keranjang dari context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hitung total item di keranjang
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold hover:text-gray-300">
            Pusat Layanan Kemasan
          </Link>
          <ul className="flex space-x-6 items-center">
            {/* Link yang selalu ada */}
            <li><Link to="/" className="hover:text-gray-300">Home/Blog</Link></li>
            <li><Link to="/shop" className="hover:text-gray-300 font-semibold">Beli Produk</Link></li>

            {user ? (
              // === TAMPILAN JIKA SUDAH LOGIN ===
              <>
                {/* Tampilkan link peran internal (non-pembeli) */}
                {user.id_peran !== 5 && <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>}
                {(user.id_peran === 1 || user.id_peran === 3) && <Link to="/design" className="hover:text-gray-300">Desain</Link>}
                {(user.id_peran === 1 || user.id_peran === 4) && <Link to="/production" className="hover:text-gray-300">Produksi</Link>}
                {(user.id_peran === 1 || user.id_peran === 2) && <Link to="/cashier" className="hover:text-gray-300">Kasir</Link>}
                {(user.id_peran === 1 || user.id_peran === 6) && <Link to="/manager" className="hover:text-gray-300">Laporan</Link>}

                {/* Ikon Keranjang */}
                <li>
                  <Link to="/cart" className="relative hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {totalItemsInCart > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItemsInCart}
                      </span>
                    )}
                  </Link>
                </li>

                <li className="font-semibold text-yellow-400">Halo, {user.username}!</li>
                <li><button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button></li>
              </>
            ) : (
              // === TAMPILAN JIKA BELUM LOGIN ===
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