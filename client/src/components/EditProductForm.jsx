import { useState, useEffect } from 'react';

function EditProductForm({ onClose, onProductUpdated, productToEdit }) {
  const [formData, setFormData] = useState({
    nama_produk: '',
    deskripsi: '',
    harga: '',
    jumlah_stok: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nama_produk: productToEdit.nama_produk || '',
        deskripsi: productToEdit.deskripsi || '',
        harga: productToEdit.harga || '',
        jumlah_stok: productToEdit.jumlah_stok || '',
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/products/${productToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal memperbarui produk');

      onProductUpdated(); // Memanggil fungsi refresh di Dashboard
      onClose(); // Menutup modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Produk</h2>
        <form onSubmit={handleSubmit}>
          {/* Isi form (input nama, deskripsi, harga, stok) */}
          <div className="mb-4">
            <label className="block text-gray-700">Nama Produk</label>
            <input name="nama_produk" type="text" value={formData.nama_produk} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Deskripsi</label>
            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Harga</label>
            <input name="harga" type="number" value={formData.harga} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Jumlah Stok</label>
            <input name="jumlah_stok" type="number" value={formData.jumlah_stok} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
            <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductForm;