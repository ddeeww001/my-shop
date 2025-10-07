const express = require('express');
const router = express.Router();
const db = require("../config/db");
const multer = require('multer');
const path = require('path');

// ตั้งค่า multer สำหรับอัปโหลดรูป
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/') // สร้างโฟลเดอร์ public/uploads/
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/list', async (req, res) => {
    try{
        const [rows] = await db.query('SELECT * FROM products ORDER BY name' );
        res.json(rows);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: 'SERVER ERROR'});
    }
});

// ดึงสินค้าโดย ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// เพิ่มสินค้าใหม่ (รองรับรูปภาพ)
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    let query, params;

    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      query = 'INSERT INTO products (name, price, stock, image) VALUES (?, ?, ?, ?)';
      params = [name, price, stock || 0, imagePath];
    } else {
      query = 'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)';
      params = [name, price, stock || 0];
    }

    await db.query(query, params);

    res.redirect('/products.html?success=added');
  } catch (err) {
    console.error(err);
    res.redirect('/addProduct.html?error=failed');
  }
});

module.exports = router;
