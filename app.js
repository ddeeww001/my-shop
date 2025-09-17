// โหลด environment variables (.env)
require('dotenv').config();

// โหลด Express
const express = require('express');
const app = express();

// ---------- Middleware ----------
app.use(express.json()); // รองรับ JSON body
app.use(express.urlencoded({ extended: true })); // รองรับ form-urlencoded
app.use(express.static('public')); // เสิร์ฟไฟล์ใน public/

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.send('Welcome to Mini POS API 🎉');
});

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
});
