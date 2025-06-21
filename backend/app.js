// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../.env' });
}

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const path = require('path');
const fs = require('fs'); // Required for file existence check

// Database connection
connectToDb();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/captains', require('./routes/captain.routes'));
app.use('/maps', require('./routes/maps.routes'));
app.use('/rides', require('./routes/ride.routes'));
app.use('/payments', require('./routes/payment.routes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist'); // Adjusted path for Render
  
  // Verify the build exists
  if (!fs.existsSync(frontendPath)) {
    console.error('Frontend build not found at:', frontendPath);
    process.exit(1);
  }

  console.log('Serving static files from:', frontendPath);
  
  // Serve static files
  app.use(express.static(frontendPath));
  
  // Handle SPA routing - must come AFTER API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Hello World (Development Mode)');
  });
}

module.exports = app;