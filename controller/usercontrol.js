const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/usermodel.js');

// Register
async function register(req, res) {
  try {
    const { username, password, role } = req.body;

    // เช็คว่ามี username ซ้ำไหม
    const existing = await User.findUserByUsername(username);
    if (existing) return res.status(400).json({ error: 'Username already taken' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user
    const userId = await User.createUser(username, hashedPassword, role);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findUserByUsername(username);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    // generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { register, login };
