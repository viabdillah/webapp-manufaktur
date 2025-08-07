const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/authMiddleware');

// Semua rute di file ini memerlukan login
router.use(authenticateToken);

// GET /api/cart - Mengambil semua item di keranjang pengguna
router.get('/', (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT ci.product_id, ci.quantity, p.nama_produk, p.harga, p.url_gambar
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Error server", error: err });
        res.json(results);
    });
});

// POST /api/cart - Menambah produk ke keranjang (atau update quantity)
router.post('/', (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID dan quantity harus diisi" });
    }

    // 'ON DUPLICATE KEY UPDATE' adalah trik SQL yang sangat berguna.
    // Jika user_id dan product_id sudah ada, ia akan menjalankan bagian UPDATE.
    // Jika belum ada, ia akan menjalankan bagian INSERT.
    const sql = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + ?;
    `;
    db.query(sql, [userId, productId, quantity, quantity], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal menambahkan ke keranjang", error: err });
        res.status(201).json({ message: "Produk berhasil ditambahkan ke keranjang" });
    });
});

// DELETE /api/cart/:productId - Menghapus produk dari keranjang
router.delete('/:productId', (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    const sql = "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?";
    db.query(sql, [userId, productId], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal menghapus dari keranjang", error: err });
        res.json({ message: "Produk berhasil dihapus dari keranjang" });
    });
});

module.exports = router;