import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AddProductForm from '../components/AddProductForm';

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // DEFINISI FUNGSI DIPINDAHKAN KE SINI (SCOPE KOMPONEN UTAMA)
  const fetchProducts = async () => {
    try {
      setLoading(true);
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

  // useEffect sekarang hanya memanggil fungsi tersebut
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center">Memuat data produk...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard Produk</h1>
      <p className="mb-6">Selamat datang, {user.username}!</p>
      
      {user && user.id_peran === 1 && (
        <div className="mb-6">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
          >
            + Tambah Produk Baru
          </button>
        </div>
      )}

      {isFormOpen && (
        <AddProductForm 
          onClose={() => setIsFormOpen(false)}
          onProductAdded={fetchProducts} // SEKARANG FUNGSI INI BISA DILIHAT
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{product.nama_produk}</h2>
              <p className="text-gray-600 mb-4">{product.deskripsi}</p>
              <div className="text-lg font-bold text-blue-600">
                Rp {new Intl.NumberFormat('id-ID').format(product.harga)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Stok: {product.jumlah_stok}
              </div>
            </div>
          ))
        ) : (
          <p>Belum ada produk yang ditambahkan.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;