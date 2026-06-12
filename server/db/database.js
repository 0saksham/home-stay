const Database = require('better-sqlite3');
const path     = require('path');

// Use process.cwd() so the path is always absolute and correct on Render
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db     = new Database(dbPath);

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
      email TEXT,
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

  // Migrate: add email column to otps if it was created without it
  try {
    db.exec(`ALTER TABLE otps ADD COLUMN email TEXT`);
    console.log('DB migration: added email column to otps table.');
  } catch {
    // Column already exists — ignore
  }

  console.log(`SQLite database initialised at: ${dbPath}`);
}

initDb();

module.exports = db;
