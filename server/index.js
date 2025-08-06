const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
require('dotenv').config();

// Mengimpor koneksi database
const db = require('./database'); 

// Mengimpor middleware dari file terpisah (DENGAN PERBAIKAN)
const { authenticateToken } = require('./middleware/authMiddleware');

// Mengimpor file-file rute
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = 3001;

// Middleware global
app.use(cors());
app.use(express.json());

// === PENGGUNAAN ROUTES ===
// Memberitahu Express untuk menggunakan file rute
app.use('/api', authRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

// Endpoint profil yang dilindungi (sekarang akan berfungsi)
app.get('/api/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});

// Menjalankan server
app.listen(port, () => {
    // Pesan ini tidak akan muncul sampai koneksi db berhasil
    // Karena koneksi db sekarang dilakukan di file database.js,
    // pesan sukses koneksi akan muncul dari sana.
    console.log(`Server berjalan di http://localhost:${port}`);
});