const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

// Endpoint untuk registrasi pengguna baru
// URL lengkapnya akan menjadi: POST /api/register
router.post('/register', async (req, res) => {
    const { nama_lengkap, username, password, id_peran } = req.body;
    if (!nama_lengkap || !username || !password || !id_peran) {
        return res.status(400).json({ message: 'Semua kolom harus diisi' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (nama_lengkap, username, password, id_peran) VALUES (?, ?, ?, ?)";
        db.query(sql, [nama_lengkap, username, hashedPassword, id_peran], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Username sudah terdaftar' });
                }
                console.error(err);
                return res.status(500).json({ message: 'Gagal mendaftarkan pengguna' });
            }
            res.status(201).json({ message: 'Registrasi berhasil' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// Endpoint untuk login pengguna
// URL lengkapnya akan menjadi: POST /api/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password harus diisi' });
    }
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Username tidak ditemukan' });
        }
        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }
        const payload = {
            id: user.id,
            username: user.username,
            id_peran: user.id_peran
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({
            message: 'Login berhasil',
            token: token
        });
    });
});

module.exports = router;