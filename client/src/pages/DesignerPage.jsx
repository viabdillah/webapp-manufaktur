import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InputModal from '../components/InputModal';

function DesignerPage() {
  const [newOrders, setNewOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchNewOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/orders/new', {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const handleOpenModal = (orderId, event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedOrder(orderId);
    setIsModalOpen(true);
  };

  const handleCompleteDesign = async (designUrl) => {
    if (!designUrl) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/orders/${selectedOrder}/design`, {
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
      setIsModalOpen(false);
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
      <InputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCompleteDesign}
        title="Selesaikan Desain"
        message={`Masukkan URL desain final untuk pesanan ID: ${selectedOrder}`}
        inputLabel="URL Desain Final"
        submitText="Selesaikan"
      />
      <div className="space-y-4">
        {newOrders.map(order => (
          <Link to={`/order/${order.id}`} key={order.id} className="block group">
            <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center transition-all duration-300 group-hover:shadow-lg group-hover:border-blue-500 border border-transparent">
              <div>
                <h2 className="text-xl font-semibold">{order.nama_pesanan}</h2>
                <p className="text-sm text-gray-500">ID Pesanan: {order.id} | Status: <span className="font-bold text-blue-600">{order.status_pesanan}</span></p>
              </div>
              <button 
                onClick={(e) => handleOpenModal(order.id, e)}
                className="px-4 py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 z-10"
              >
                Selesaikan Desain
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DesignerPage;