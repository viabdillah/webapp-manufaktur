import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function OrderDetailPage() {
  // useParams() adalah hook dari React Router untuk mengambil parameter dari URL (misal: :id)
  const { orderId } = useParams(); 

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Gagal mengambil detail pesanan');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]); // Efek ini akan berjalan lagi jika orderId berubah

  if (loading) return <p className="text-center">Memuat detail pesanan...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!order) return <p className="text-center">Pesanan tidak ditemukan.</p>;

  // Helper untuk format tanggal
  const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID');

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold">Detail Pesanan #{order.id}</h1>
        <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${
          order.status_pesanan === 'BARU' ? 'bg-blue-500' :
          order.status_pesanan === 'PROSES_PRODUKSI' ? 'bg-yellow-500' :
          order.status_pesanan === 'SELESAI' ? 'bg-green-500' :
          order.status_pesanan === 'DIBAYAR' ? 'bg-purple-600' : 'bg-gray-500'
        }`}>
          {order.status_pesanan.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Informasi Pesanan</h2>
          <p><strong>Nama Pesanan:</strong> {order.nama_pesanan}</p>
          <p><strong>Tanggal Dibuat:</strong> {formatDate(order.tanggal_dibuat)}</p>
          <p><strong>PIRT:</strong> {order.nomor_pirt || '-'}</p>
          <p><strong>No. Halal:</strong> {order.nomor_halal || '-'}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Pihak Terkait</h2>
          <p><strong>Nama Pembeli:</strong> {order.nama_pembeli}</p>
          <p><strong>Desainer:</strong> {order.nama_desainer || 'Belum Ditugaskan'}</p>
          <p><strong>Staf Produksi:</strong> {order.nama_produksi || 'Belum Ditugaskan'}</p>
        </div>
      </div>

      <div className="mt-8">
         <h2 className="text-xl font-semibold mb-3">File Desain</h2>
         {order.url_desain_final ? (
            <a href={order.url_desain_final} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Lihat Desain Final
            </a>
         ) : (
            <p>Desain final belum tersedia.</p>
         )}
      </div>
    </div>
  );
}

export default OrderDetailPage;