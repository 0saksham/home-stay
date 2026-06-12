require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/booking');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/booking', bookingRoutes);

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'The Nest Stay API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
