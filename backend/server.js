const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const universityRoutes = require('./routes/universities');
const programRoutes = require('./routes/programs');
const cityRoutes = require('./routes/cities');
const { router: uploadRoutes } = require('./routes/uploads');
const programNamesRoutes = require('./routes/programNames');
const adminRoutes = require('./routes/admin');
const studentProgramRoutes = require('./routes/studentPrograms');
const statisticsRoutes = require('./routes/statistics');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'MalishaEdu Global Scholarship Platform API',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      universities: '/api/universities',
      programs: '/api/programs',
      cities: '/api/cities',
      uploads: '/api/uploads',
      admin: '/api/admin',
      studentPrograms: '/api/student-programs',
      statistics: '/api/statistics'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
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
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
