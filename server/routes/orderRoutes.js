const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// ... (Rute untuk Pembeli, Desainer, dan Produksi dari langkah sebelumnya tetap di sini) ...
// === RUTE UNTUK PEMBELI ===
router.post('/', authenticateToken, (req, res) => {
    const id_pembeli = req.user.id;
    const { nama_pesanan, nomor_pirt, nomor_halal, url_desain_pembeli } = req.body;
    if (!nama_pesanan) return res.status(400).json({ message: 'Nama pesanan harus diisi' });
    const sql = "INSERT INTO orders (id_pembeli, nama_pesanan, nomor_pirt, nomor_halal, url_desain_pembeli) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [id_pembeli, nama_pesanan, nomor_pirt, nomor_halal, url_desain_pembeli], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal menyimpan pesanan', error: err });
        res.status(201).json({ message: 'Pesanan berhasil dibuat', orderId: result.insertId });
    });
});

// === RUTE UNTUK DESAINER ===
const designerAccess = [authenticateToken, authorizeRole([3, 1])];
router.get('/new', designerAccess, (req, res) => {
    const sql = "SELECT * FROM orders WHERE status_pesanan = 'BARU' ORDER BY tanggal_dibuat ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error server', error: err });
        res.json(results);
    });
});
router.put('/:id/design', designerAccess, (req, res) => {
    const { url_desain_final } = req.body;
    if (!url_desain_final) return res.status(400).json({ message: 'URL desain final harus diisi' });
    const sql = "UPDATE orders SET id_desainer = ?, url_desain_final = ?, status_pesanan = 'PROSES_PRODUKSI' WHERE id = ? AND status_pesanan = 'BARU'";
    db.query(sql, [req.user.id, url_desain_final, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal update pesanan', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan atau sudah diproses' });
        res.json({ message: 'Desain berhasil diselesaikan, pesanan dilanjutkan ke produksi' });
    });
});

// === RUTE UNTUK PRODUKSI ===
const productionAccess = [authenticateToken, authorizeRole([4, 1])];
router.get('/production', productionAccess, (req, res) => {
    const sql = "SELECT * FROM orders WHERE status_pesanan = 'PROSES_PRODUKSI' ORDER BY tanggal_dibuat ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error server', error: err });
        res.json(results);
    });
});
router.put('/:id/complete', productionAccess, (req, res) => {
    const sql = "UPDATE orders SET id_produksi = ?, status_pesanan = 'SELESAI' WHERE id = ? AND status_pesanan = 'PROSES_PRODUKSI'";
    db.query(sql, [req.user.id, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal menyelesaikan pesanan', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan atau status tidak sesuai' });
        res.json({ message: 'Produksi berhasil diselesaikan' });
    });
});


// === RUTE UNTUK KASIR ===
// Kita asumsikan id_peran untuk Kasir adalah 2
const cashierAccess = [authenticateToken, authorizeRole([2, 1])]; // Kasir (2) dan Admin (1)

// GET /api/orders/completed - Melihat semua pesanan yang siap dibayar
router.get('/completed', cashierAccess, (req, res) => {
    const sql = "SELECT * FROM orders WHERE status_pesanan = 'SELESAI' ORDER BY tanggal_dibuat ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error server', error: err });
        res.json(results);
    });
});

// POST /api/orders/:id/pay - Kasir memproses pembayaran
router.post('/:id/pay', cashierAccess, (req, res) => {
    const orderId = req.params.id;
    const cashierId = req.user.id;
    const { total_bayar, metode_bayar } = req.body;

    if (!total_bayar) {
        return res.status(400).json({ message: 'Total bayar harus diisi' });
    }

    // 1. Masukkan data ke tabel invoices
    const invoiceSql = "INSERT INTO invoices (id_order, id_kasir, total_bayar, metode_bayar) VALUES (?, ?, ?, ?)";
    db.query(invoiceSql, [orderId, cashierId, total_bayar, metode_bayar], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal mencatat invoice', error: err });

        // 2. Jika invoice berhasil, update status order menjadi 'DIBAYAR'
        const orderSql = "UPDATE orders SET status_pesanan = 'DIBAYAR' WHERE id = ? AND status_pesanan = 'SELESAI'";
        db.query(orderSql, [orderId], (err, result) => {
            if (err) return res.status(500).json({ message: 'Gagal update status pesanan', error: err });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan atau status tidak sesuai' });

            res.status(201).json({ message: 'Pembayaran berhasil dan pesanan telah selesai' });
        });
    });
});


module.exports = router;