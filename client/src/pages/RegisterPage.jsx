import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  // State untuk setiap input di form
  const [namaLengkap, setNamaLengkap] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idPeran, setIdPeran] = useState(5); // Default ke peran 'Pembeli'

  // State untuk pesan sukses atau error
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const userData = {
      nama_lengkap: namaLengkap,
      username: username,
      password: password,
      id_peran: parseInt(idPeran), // Pastikan id_peran adalah angka
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal!');
      }

      // Jika registrasi berhasil
      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login...');
      // Tunggu 3 detik, lalu arahkan ke halaman login
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Register Akun Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="namaLengkap" className="text-sm font-semibold text-gray-600 block">Nama Lengkap</label>
            <input
              id="namaLengkap" type="text" value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="text-sm font-semibold text-gray-600 block">Username</label>
            <input
              id="username" type="text" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-gray-600 block">Password</label>
            <input
              id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="idPeran" className="text-sm font-semibold text-gray-600 block">Daftar Sebagai</label>
            <select 
              id="idPeran" value={idPeran}
              onChange={(e) => setIdPeran(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value={5}>Pembeli</option>
              <option value={2}>Kasir</option>
              <option value={3}>Desainer</option>
              <option value={4}>Produksi</option>
              {/* Kita tidak mengizinkan registrasi Admin dari sini */}
            </select>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {success && <p className="text-sm text-green-600 text-center">{success}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;