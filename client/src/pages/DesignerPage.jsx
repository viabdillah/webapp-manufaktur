import { useState, useEffect } from 'react';

function DesignerPage() {
  const [newOrders, setNewOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNewOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/orders/new', { // API untuk mengambil order baru
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil data pesanan baru');
      }
      const data = await response.json();
      setNewOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewOrders();
  }, []);

  const handleCompleteDesign = async (orderId) => {
    // Minta input URL desain final dari desainer
    const designUrl = window.prompt("Silakan masukkan URL desain final:");
    if (!designUrl) {
      // Jika pengguna membatalkan atau tidak mengisi, hentikan proses
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/orders/${orderId}/design`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url_desain_final: designUrl })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal menyelesaikan desain');
      }
      // Jika berhasil, refresh daftar pesanan
      fetchNewOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center">Memuat antrean desain...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Antrean Desain</h1>
      <div className="space-y-4">
        {newOrders.length > 0 ? (
          newOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{order.nama_pesanan}</h2>
                <p className="text-sm text-gray-500">ID Pesanan: {order.id} | Status: <span className="font-bold text-blue-600">{order.status_pesanan}</span></p>
              </div>
              <button 
                onClick={() => handleCompleteDesign(order.id)}
                className="px-4 py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700"
              >
                Selesaikan Desain
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada pesanan di antrean desain.</p>
        )}
      </div>
    </div>
  );
}

export default DesignerPage;