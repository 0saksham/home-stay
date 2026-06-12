const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'nest_stay.db');
const db = new Database(dbPath);

// Initialize Schema
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile TEXT UNIQUE,
      name TEXT,
      email TEXT,
      age INTEGER,
      city TEXT,
      id_type TEXT,
      id_number TEXT,
      guests_count INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile TEXT,
      otp_code TEXT,
      expires_at DATETIME,
      used BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_ref TEXT UNIQUE,
      user_id INTEGER,
      room_type TEXT,
      checkin_date TEXT,
      checkout_date TEXT,
      nights INTEGER,
      total_amount INTEGER,
      special_requests TEXT,
      status TEXT DEFAULT 'CONFIRMED',
      agreed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  console.log('SQLite database initialized.');
}

initDb();

module.exports = db;
