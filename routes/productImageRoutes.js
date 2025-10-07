const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db');

// Use memory storage so file buffers are available directly
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// POST /images/upload
// multipart/form-data with field 'image'
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { originalname, mimetype, buffer } = req.file;

    const query = `INSERT INTO images (image_name, image_type, image_data) VALUES (?, ?, ?)`;
    const params = [originalname, mimetype, buffer];

    const [result] = await db.query(query, params);

    res.status(201).json({ message: 'Image uploaded', id: result.insertId });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET /images/:id
// Returns the image binary with Content-Type set
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query('SELECT image_name, image_type, image_data FROM images WHERE image_id = ?', [id]);

    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Image not found' });

    const image = rows[0];
    res.setHeader('Content-Type', image.image_type || 'application/octet-stream');
    // Optionally set Content-Disposition to suggest a filename
    res.setHeader('Content-Disposition', `inline; filename="${image.image_name}"`);
    res.send(image.image_data);
  } catch (err) {
    console.error('Get image error:', err);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

module.exports = router;
