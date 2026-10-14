const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cv_generator_db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

// Test initial connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✓ Terhubung ke database MySQL (cv_generator_db)');
        connection.release();
    } catch (err) {
        console.error('✗ Gagal terhubung ke database MySQL:', err.message);
    }
})();

module.exports = pool;
