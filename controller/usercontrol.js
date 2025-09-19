const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/usermodel.js');

// Register
async function register(req, res) {
  try {
    let { username, password, role } = req.body;
    if (!role) role = 'admin'; // เพิ่มบรรทัดนี้

    // เช็คว่ามี username ซ้ำไหม
    const existing = await User.findUserByUsername(username);
    if (existing) {
      // ถ้ามาจากฟอร์ม HTML ให้ redirect กลับ reg.html พร้อม query error
      return res.redirect('/reg.html?error=UsernameTaken');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user
    const userId = await User.createUser(username, hashedPassword, role);

    // ถ้ามาจากฟอร์ม HTML ให้ redirect ไปหน้า login หรือหน้าอื่น
    return res.redirect('/'); // หรือ /login.html ถ้ามี
  } catch (err) {
    console.error(err);
    // redirect พร้อม error
    return res.redirect('/reg.html?error=ServerError');
  }
}

// Login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findUserByUsername(username);
    if (!user) {
      return res.redirect('/login.html?error=UserNotFound');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.redirect('/login.html?error=WrongPassword');
    }
    // ถ้า login สำเร็จ
    return res.redirect('/dashboard.html');
  } catch (err) {
    console.error(err);
    return res.redirect('/login.html?error=ServerError');
  }
}

module.exports = { register, login };
