import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function CartPage() {
  // Ambil data dan fungsi dari CartContext
  const { cartItems, removeFromCart, loading } = useContext(CartContext);

  // Hitung total harga
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.harga * item.quantity);
  }, 0);

  if (loading) return <p className="text-center">Memuat keranjang...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja Anda</h1>

      {cartItems.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600">Keranjang Anda kosong.</p>
          <Link to="/shop" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Daftar Item */}
          {cartItems.map(item => (
            <div key={item.product_id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div> {/* Placeholder Gambar */}
                <div>
                  <h2 className="font-semibold">{item.nama_produk}</h2>
                  <p className="text-sm text-gray-500">Jumlah: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <p className="font-semibold">Rp {new Intl.NumberFormat('id-ID').format(item.harga * item.quantity)}</p>
                <button 
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}

          {/* Total Belanja */}
          <div className="mt-6 flex justify-end items-center">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-blue-600 ml-4">
              Rp {new Intl.NumberFormat('id-ID').format(totalPrice)}
            </span>
          </div>

          {/* Tombol Checkout */}
          <div className="mt-6 flex justify-end">
            <button className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;