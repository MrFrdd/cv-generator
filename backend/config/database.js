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

const fs = require('fs');
const path = require('path');

// Auto initialize tables if not exists
async function initializeTables(connection) {
    try {
        const schemaPath = path.join(__dirname, '../sql/schema.sql');
        if (fs.existsSync(schemaPath)) {
            const sqlContent = fs.readFileSync(schemaPath, 'utf8');
            const statements = sqlContent
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE '));

            for (const statement of statements) {
                await connection.query(statement);
            }
            console.log('✓ Struktur tabel dan template standar terverifikasi siap');
        }
    } catch (initErr) {
        console.warn('ℹ Catatan inisialisasi tabel database:', initErr.message);
    }
}

// Test initial connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✓ Terhubung ke database MySQL (${process.env.DB_NAME || 'cv_generator_db'})`);
        await initializeTables(connection);
        connection.release();
    } catch (err) {
        console.error('✗ Gagal terhubung ke database MySQL:', err.message);
    }
})();

module.exports = pool;
