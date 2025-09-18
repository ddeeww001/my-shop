const db = require('../config/db.js');

async function createUser(username, hashedPassword, role = 'cashier') {
  const [result] = await db.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role]
  );
  return result.insertId;
}

async function findUserByUsername(username) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
}

module.exports = { createUser, findUserByUsername };
