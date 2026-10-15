const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const cvRoutes = require('./routes/cvRoutes');
const templateRoutes = require('./routes/templateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
    let dbStatus = 'DISCONNECTED';
    let dbError = null;
    try {
        await pool.query('SELECT 1');
        dbStatus = 'CONNECTED';
    } catch (err) {
        dbStatus = 'ERROR';
        dbError = err.message;
    }

    res.json({
        status: 'UP',
        message: 'Backend CV Generator API berjalan dengan baik',
        database: {
            status: dbStatus,
            configured_host: process.env.DB_HOST || (process.env.DATABASE_URL ? 'via DATABASE_URL' : 'localhost (default)'),
            ssl: process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')),
            error: dbError
        },
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Ukuran berkas terlalu besar. Maksimum 2 MB.'
            });
        }
    }
    return res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal server.'
    });
});

// Static frontend build (jika ada, untuk hosting fullstack Glitch)
const fs = require('fs');
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
        if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
            return next();
        }
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}

// 404 Route for unhandled API endpoints
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} tidak ditemukan.`
    });
});

app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Server CV Generator aktif di port ${PORT}`);
    console.log(`📡 URL API: http://localhost:${PORT}/api`);
    console.log(`===============================================`);
});

module.exports = app;
