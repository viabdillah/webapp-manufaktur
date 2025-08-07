import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Pastikan Link diimpor

function CashierPage() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCompletedOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/orders/completed', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil data pesanan');
      }
      const data = await response.json();
      setCompletedOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const handlePayment = async (orderId, event) => {
    event.preventDefault(); // Mencegah navigasi saat tombol diklik
    event.stopPropagation(); // Mencegah event "klik" menyebar ke Link

    const totalBayar = window.prompt("Masukkan total pembayaran:");
    if (!totalBayar || isNaN(totalBayar)) {
      alert("Total pembayaran harus berupa angka.");
      return;
    }
    const metodeBayar = window.prompt("Masukkan metode pembayaran (Tunai/QRIS/dll):", "Tunai");
    if (!metodeBayar) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ total_bayar: parseFloat(totalBayar), metode_bayar: metodeBayar })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal memproses pembayaran');
      }
      alert('Pembayaran berhasil!');
      fetchCompletedOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center">Memuat pesanan yang siap dibayar...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Halaman Kasir</h1>
      <div className="space-y-4">
        {completedOrders.length > 0 ? (
          completedOrders.map(order => (
            // ==== PERUBAHAN DIMULAI DI SINI ====
            <Link to={`/order/${order.id}`} key={order.id} className="block group">
              <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center transition-all duration-300 group-hover:shadow-lg group-hover:border-purple-500 border border-transparent">
                <div>
                  <h2 className="text-xl font-semibold">{order.nama_pesanan}</h2>
                  <p className="text-sm text-gray-500">ID Pesanan: {order.id} | Status: <span className="font-bold text-green-600">{order.status_pesanan}</span></p>
                </div>
                <button 
                  onClick={(e) => handlePayment(order.id, e)}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 z-10"
                >
                  Proses Pembayaran
                </button>
              </div>
            </Link>
            // ==== AKHIR DARI PERUBAHAN ====
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada pesanan yang perlu dibayar.</p>
        )}
      </div>
    </div>
  );
}

export default CashierPage;