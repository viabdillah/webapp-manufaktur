const jwt = require('jsonwebtoken');

// Middleware untuk memeriksa apakah token valid
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid' });
        }
        req.user = user;
        next();
    });
}

// Middleware BARU untuk memeriksa peran pengguna
// Ini adalah "function factory": sebuah fungsi yang menghasilkan middleware
function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        // Kita asumsikan middleware ini dijalankan SETELAH authenticateToken,
        // sehingga req.user sudah ada.
        const userRole = req.user.id_peran;

        if (allowedRoles.includes(userRole)) {
            // Jika peran pengguna ada di dalam daftar peran yang diizinkan, lanjutkan
            next();
        } else {
            // Jika tidak, tolak akses
            res.status(403).json({ message: 'Akses ditolak. Peran tidak diizinkan.' });
        }
    };
}

// Ekspor kedua fungsi
module.exports = {
    authenticateToken,
    authorizeRole
};