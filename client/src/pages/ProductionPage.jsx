import { useState, useEffect } from 'react';

function ProductionPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProductionOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/orders/production', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil data produksi');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductionOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    if (!window.confirm("Apakah Anda yakin pesanan ini sudah selesai diproduksi?")) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/orders/${orderId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal menyelesaikan pesanan');
      }
      // Jika berhasil, refresh daftar pesanan
      fetchProductionOrders();
    } catch (err) {
      alert(err.message); // Tampilkan error sebagai alert
    }
  };

  if (loading) return <p className="text-center">Memuat antrean produksi...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Antrean Produksi</h1>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{order.nama_pesanan}</h2>
                <p className="text-sm text-gray-500">ID Pesanan: {order.id} | Status: <span className="font-bold text-yellow-600">{order.status_pesanan}</span></p>
              </div>
              <button 
                onClick={() => handleCompleteOrder(order.id)}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
              >
                Selesaikan Produksi
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada pesanan di antrean produksi.</p>
        )}
      </div>
    </div>
  );
}

export default ProductionPage;