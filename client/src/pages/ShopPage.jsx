import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext); // Untuk memeriksa apakah user sudah login
  const { addToCart } = useContext(CartContext); // Ambil fungsi addToCart

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    if (!user) {
      alert("Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.");
      return;
    }
    addToCart(productId, 1);
    alert("Produk berhasil ditambahkan ke keranjang!");
  };

  if (loading) return <p className="text-center">Memuat produk...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Toko Produk Kami</h1>
        <p className="text-lg text-gray-600 mt-2">Pilih produk siap pakai untuk melengkapi kebutuhan Anda.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {/* Placeholder untuk gambar */}
              <span className="text-gray-500">Gambar Produk</span>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{product.nama_produk}</h2>
              <p className="text-gray-600 mt-1">Rp {new Intl.NumberFormat('id-ID').format(product.harga)}</p>
              <p className="text-sm text-gray-500 mt-2">Stok: {product.jumlah_stok}</p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopPage;