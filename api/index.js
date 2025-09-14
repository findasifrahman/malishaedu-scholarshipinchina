// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('../backend/routes/auth');
const universityRoutes = require('../backend/routes/universities');
const programRoutes = require('../backend/routes/programs');
const cityRoutes = require('../backend/routes/cities');
const { router: uploadRoutes } = require('../backend/routes/uploads');
const programNamesRoutes = require('../backend/routes/programNames');
const adminRoutes = require('../backend/routes/admin');
const studentProgramRoutes = require('../backend/routes/studentPrograms');
const statisticsRoutes = require('../backend/routes/statistics');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/program-names', programNamesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student-programs', studentProgramRoutes);
app.use('/api/statistics', statisticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
