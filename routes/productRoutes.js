const express = require('express');
const router = express.Router();
const db = require("../config/db");

router.get('/list', async (req, res) => {
    try{
        const [rows] = await db.query('SELECT * FROM products ORDER BY name' );
        res.json(rows); // เปลี่ยนจาก row เป็น rows
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: 'SERVER ERROR'}); // แก้ไข SEVER เป็น SERVER
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

// เพิ่มสินค้าใหม่
router.post('/add', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    
    const query = 'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [name, price, stock || 0]);
    
    // redirect กลับไปหน้า products หลังเพิ่มสำเร็จ
    res.redirect('/products.html?success=added');
  } catch (err) {
    console.error(err);
    res.redirect('/addProduct.html?error=failed');
  }
});

module.exports = router;
