const express = require('express');
const router = express.Router();
const db = require('../database');
// Impor middleware sebagai objek
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// === API Rute untuk Produk ===

// GET: Mendapatkan semua produk (Publik)
router.get('/', (req, res) => {
    const sql = "SELECT * FROM products ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error server', error: err });
        res.json(results);
    });
});

// GET: Mendapatkan satu produk berdasarkan ID (Publik)
router.get('/:id', (req, res) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error server', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
        res.json(results[0]);
    });
});

// Middleware untuk rute di bawah ini:
// 1. authenticateToken: Pastikan pengguna sudah login.
// 2. authorizeRole([1]): Pastikan pengguna yang login memiliki id_peran = 1 (Admin).
const adminAccess = [authenticateToken, authorizeRole([1])];

// POST: Membuat produk baru (Hanya Admin)
router.post('/', adminAccess, (req, res) => {
    const { nama_produk, deskripsi, harga, jumlah_stok, url_gambar } = req.body;
    if (!nama_produk || harga === undefined) {
        return res.status(400).json({ message: 'Nama produk dan harga harus diisi' });
    }
    const sql = "INSERT INTO products (nama_produk, deskripsi, harga, jumlah_stok, url_gambar) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nama_produk, deskripsi, harga, jumlah_stok, url_gambar], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal membuat produk', error: err });
        res.status(201).json({ message: 'Produk berhasil dibuat', productId: result.insertId });
    });
});

// PUT: Memperbarui produk berdasarkan ID (Hanya Admin)
router.put('/:id', adminAccess, (req, res) => {
    const { nama_produk, deskripsi, harga, jumlah_stok, url_gambar } = req.body;
    if (!nama_produk || harga === undefined) {
        return res.status(400).json({ message: 'Nama produk dan harga harus diisi' });
    }
    const sql = "UPDATE products SET nama_produk = ?, deskripsi = ?, harga = ?, jumlah_stok = ?, url_gambar = ? WHERE id = ?";
    db.query(sql, [nama_produk, deskripsi, harga, jumlah_stok, url_gambar, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal memperbarui produk', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
        res.json({ message: 'Produk berhasil diperbarui' });
    });
});

// DELETE: Menghapus produk berdasarkan ID (Hanya Admin)
router.delete('/:id', adminAccess, (req, res) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus produk', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
        res.json({ message: 'Produk berhasil dihapus' });
    });
});

module.exports = router;