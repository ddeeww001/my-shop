// โหลด environment variables (.env)
require('dotenv').config();

// โหลด Express
const express = require('express');
const app = express();

// ---------- Middleware ----------
app.use(express.json()); // รองรับ JSON body
app.use(express.urlencoded({ extended: true })); // รองรับ form-urlencoded
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
})); // เสิร์ฟไฟล์ใน public/

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.send('Welcome to Mini POS API 🎉');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Image upload / retrieval routes
// POST /images/upload (multipart/form-data field name: 'image')
// GET  /images/:id -> returns the image binary
const productImageRoutes = require('./routes/productImageRoutes');
app.use('/images', productImageRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log('Image endpoints: POST /images/upload  GET /images/:id');
});
