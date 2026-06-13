require('dotenv').config();   // Render injects env vars natively — no path needed

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/user');
const bookingRoutes = require('./routes/booking');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── CORS ── */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://home-stay-3ihd.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    callback(new Error('Blocked by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options(/.*/, cors());

app.use(express.json());

/* ── Routes ── */
app.use('/api/auth',    authRoutes);
app.use('/api/user',    userRoutes);
app.use('/api/booking', bookingRoutes);

/* ── Health check — used by client wake-up ping ── */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'awake', service: 'House of Marigold', ts: Date.now() });
});

app.listen(PORT, () => {
  console.log(`[House of Marigold] Server running on port ${PORT}`);
});
