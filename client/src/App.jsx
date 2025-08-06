import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="container mx-auto mt-6 p-4">
        {/* Konten halaman akan dirender di sini */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;