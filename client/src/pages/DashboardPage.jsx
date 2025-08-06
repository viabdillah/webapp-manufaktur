import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AddProductForm from '../components/AddProductForm';
import EditProductForm from '../components/EditProductForm.jsx';


function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenEditForm = (product) => {
  setSelectedProduct(product);
  setIsEditFormOpen(true);
  };

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

    const handleDelete = async (productId) => {
    // Konfirmasi sebelum menghapus
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal menghapus produk.');
      }

      // Jika berhasil, refresh daftar produk
      fetchProducts();

    } catch (err) {
      setError(err.message);
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

      {isEditFormOpen && (
        <EditProductForm 
          onClose={() => setIsEditFormOpen(false)}
          onProductUpdated={fetchProducts}
          productToEdit={selectedProduct}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-md relative pt-12">

            {/* Tombol Aksi Admin (Edit & Hapus) */}
            {user && user.id_peran === 1 && (
              <div className="absolute top-3 right-3 flex space-x-2">
                <button 
                  onClick={() => handleOpenEditForm(product)}
                  className="p-1.5 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-transform transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-transform transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            )}

            {/* ==== BAGIAN YANG HILANG ADA DI BAWAH INI ==== */}
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.nama_produk}</h2>
            <p className="text-gray-600 mb-4 h-20 overflow-hidden">{product.deskripsi}</p>
            <div className="text-lg font-bold text-blue-600">
              Rp {new Intl.NumberFormat('id-ID').format(product.harga)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Stok: {product.jumlah_stok}
            </div>
            {/* ==== AKHIR DARI BAGIAN YANG HILANG ==== */}

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