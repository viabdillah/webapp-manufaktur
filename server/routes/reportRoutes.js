const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// === RUTE UNTUK ARUS KAS (KASIR) ===
const cashierAccess = [authenticateToken, authorizeRole([2, 1])]; // Kasir & Admin
router.post('/cashflow', cashierAccess, (req, res) => {
    const { tipe, jumlah, deskripsi } = req.body;
    const id_kasir = req.user.id;

    if (!tipe || !jumlah || !deskripsi) {
        return res.status(400).json({ message: 'Tipe, jumlah, dan deskripsi harus diisi' });
    }
    if (tipe !== 'PEMASUKAN' && tipe !== 'PENGELUARAN') {
        return res.status(400).json({ message: "Tipe harus 'PEMASUKAN' atau 'PENGELUARAN'" });
    }

    const sql = "INSERT INTO operational_cash_flows (id_kasir, tipe, jumlah, deskripsi) VALUES (?, ?, ?, ?)";
    db.query(sql, [id_kasir, tipe, jumlah, deskripsi], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal mencatat arus kas', error: err });
        res.status(201).json({ message: 'Arus kas berhasil dicatat' });
    });
});

// === RUTE UNTUK LAPORAN (MANAJER) ===
// Kita asumsikan id_peran untuk Manajer adalah 6
const managerAccess = [authenticateToken, authorizeRole([6, 1])]; // Manajer & Admin

// GET /api/reports/sales - Laporan Penjualan (berdasarkan tabel invoices)
router.get('/sales', managerAccess, (req, res) => {
    // Query ini menggabungkan data dari invoices, orders, dan users
    const sql = `
        SELECT 
            i.id as id_invoice, 
            i.total_bayar, 
            i.metode_bayar, 
            i.tanggal_bayar,
            o.id as id_pesanan,
            o.nama_pesanan,
            u_kasir.nama_lengkap as nama_kasir,
            u_pembeli.nama_lengkap as nama_pembeli
        FROM invoices i
        JOIN orders o ON i.id_order = o.id
        JOIN users u_kasir ON i.id_kasir = u_kasir.id
        JOIN users u_pembeli ON o.id_pembeli = u_pembeli.id
        ORDER BY i.tanggal_bayar DESC;
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error mengambil laporan penjualan', error: err });
        res.json(results);
    });
});

// GET /api/reports/cashflow - Laporan Arus Kas Operasional
router.get('/cashflow', managerAccess, (req, res) => {
    const sql = "SELECT * FROM operational_cash_flows ORDER BY tanggal_transaksi DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error mengambil laporan arus kas', error: err });
        res.json(results);
    });
});

module.exports = router;