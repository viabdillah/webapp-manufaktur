const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Helper function untuk membuat 'slug' dari judul
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

// === RUTE PUBLIK (Tidak perlu login) ===

// GET /api/blogs - Mengambil semua postingan blog
router.get('/', (req, res) => {
  // Kita JOIN dengan tabel users untuk mendapatkan nama penulis
  const sql = `
    SELECT b.*, u.nama_lengkap as author_name 
    FROM blogs b
    JOIN users u ON b.author_id = u.id
    ORDER BY b.created_at DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error server", error: err });
    res.json(results);
  });
});

// GET /api/blogs/:slug - Mengambil satu postingan blog berdasarkan slug
router.get('/:slug', (req, res) => {
  const sql = `
    SELECT b.*, u.nama_lengkap as author_name 
    FROM blogs b
    JOIN users u ON b.author_id = u.id
    WHERE b.slug = ?;
  `;
  db.query(sql, [req.params.slug], (err, results) => {
    if (err) return res.status(500).json({ message: "Error server", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Postingan tidak ditemukan" });
    res.json(results[0]);
  });
});


// === RUTE ADMIN (Perlu login sebagai Admin) ===
const adminAccess = [authenticateToken, authorizeRole([1])];

// POST /api/blogs - Membuat postingan baru
router.post('/', adminAccess, (req, res) => {
  const { title, content, image_url } = req.body;
  const author_id = req.user.id; // Ambil ID admin yang sedang login dari token
  const slug = createSlug(title);

  if (!title || !content) {
    return res.status(400).json({ message: "Judul dan konten harus diisi" });
  }

  const sql = "INSERT INTO blogs (title, slug, content, author_id, image_url) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [title, slug, content, author_id, image_url], (err, result) => {
    if (err) {
      // Menangani jika slug sudah ada (karena judul yang sama)
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Judul ini sudah digunakan.' });
      }
      return res.status(500).json({ message: "Gagal menyimpan postingan", error: err });
    }
    res.status(201).json({ message: "Postingan berhasil dibuat", postId: result.insertId });
  });
});

// PUT /api/blogs/:id - Mengedit postingan
router.put('/:id', adminAccess, (req, res) => {
  // (Fitur edit bisa kita tambahkan nanti jika diperlukan)
  res.status(501).json({ message: "Fitur edit belum diimplementasikan" });
});

// DELETE /api/blogs/:id - Menghapus postingan
router.delete('/:id', adminAccess, (req, res) => {
  // (Fitur hapus bisa kita tambahkan nanti jika diperlukan)
  res.status(501).json({ message: "Fitur hapus belum diimplementasikan" });
});

module.exports = router;