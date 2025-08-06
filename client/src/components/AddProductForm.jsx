import { useState } from 'react';

// Komponen ini menerima 3 props:
// onClose: fungsi untuk menutup modal
// onProductAdded: fungsi untuk memberitahu DashboardPage agar me-refresh daftar produk
function AddProductForm({ onClose, onProductAdded }) {
  const [namaProduk, setNamaProduk] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [jumlahStok, setJumlahStok] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Anda harus login untuk melakukan aksi ini.');
      return;
    }

    const productData = {
      nama_produk: namaProduk,
      deskripsi: deskripsi,
      harga: parseFloat(harga),
      jumlah_stok: parseInt(jumlahStok),
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Kirim token untuk otorisasi
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menambahkan produk');
      }

      // Jika berhasil
      onProductAdded(); // Panggil fungsi refresh di parent
      onClose(); // Tutup modal

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Tambah Produk Baru</h2>
        <form onSubmit={handleSubmit}>
          {/* Form Inputs */}
          <div className="mb-4">
            <label className="block text-gray-700">Nama Produk</label>
            <input type="text" value={namaProduk} onChange={e => setNamaProduk(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Deskripsi</label>
            <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className="w-full p-2 border rounded"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Harga</label>
            <input type="number" value={harga} onChange={e => setHarga(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Jumlah Stok</label>
            <input type="number" value={jumlahStok} onChange={e => setJumlahStok(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;