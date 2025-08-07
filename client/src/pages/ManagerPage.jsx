import { useState, useEffect } from 'react';

function ManagerPage() {
  const [salesReport, setSalesReport] = useState([]);
  const [cashflowReport, setCashflowReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      try {
        // Mengambil kedua laporan secara bersamaan
        const [salesRes, cashflowRes] = await Promise.all([
          fetch('/api/reports/sales', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/reports/cashflow', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!salesRes.ok || !cashflowRes.ok) {
          throw new Error('Gagal mengambil data laporan');
        }

        const salesData = await salesRes.json();
        const cashflowData = await cashflowRes.json();

        setSalesReport(salesData);
        setCashflowReport(cashflowData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p className="text-center">Memuat Laporan...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Halaman Laporan Manajer</h1>

      {/* Tabel Laporan Penjualan */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Laporan Penjualan</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">ID Invoice</th>
              <th className="border-b p-2">Nama Pesanan</th>
              <th className="border-b p-2">Total Bayar</th>
              <th className="border-b p-2">Kasir</th>
              <th className="border-b p-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {salesReport.map(item => (
              <tr key={item.id_invoice}>
                <td className="border-b p-2">{item.id_invoice}</td>
                <td className="border-b p-2">{item.nama_pesanan}</td>
                <td className="border-b p-2">Rp {new Intl.NumberFormat('id-ID').format(item.total_bayar)}</td>
                <td className="border-b p-2">{item.nama_kasir}</td>
                <td className="border-b p-2">{new Date(item.tanggal_bayar).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel Laporan Arus Kas Operasional */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Laporan Arus Kas Operasional</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Tanggal</th>
              <th className="border-b p-2">Tipe</th>
              <th className="border-b p-2">Jumlah</th>
              <th className="border-b p-2">Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {cashflowReport.map(item => (
              <tr key={item.id}>
                <td className="border-b p-2">{new Date(item.tanggal_transaksi).toLocaleString('id-ID')}</td>
                <td className={`border-b p-2 font-bold ${item.tipe === 'PEMASUKAN' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.tipe}
                </td>
                <td className="border-b p-2">Rp {new Intl.NumberFormat('id-ID').format(item.jumlah)}</td>
                <td className="border-b p-2">{item.deskripsi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerPage;