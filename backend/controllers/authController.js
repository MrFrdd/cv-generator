const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/database');
const { sendResetPasswordEmail } = require('../utils/mailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_academic_waterfall_2026_cvgen';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Register
exports.register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nama lengkap, username, email, dan password wajib diisi.'
            });
        }

        // Validasi format username
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username hanya boleh berisi huruf, angka, dan underscore (3-30 karakter).'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password minimal harus 6 karakter.'
            });
        }

        // Cek username sudah terdaftar
        const [existingUsername] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', [username.toLowerCase().trim()]);
        if (existingUsername.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan. Silakan pilih username lain.'
            });
        }

        // Cek email sudah terdaftar
        const [existingEmail] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase().trim()]);
        if (existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)',
            [name.trim(), username.toLowerCase().trim(), email.toLowerCase().trim(), hashedPassword]
        );

        const newUser = {
            id: result.insertId,
            name: name.trim(),
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim()
        };

        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: 'Registrasi berhasil!',
            data: {
                user: newUser,
                token
            }
        });
    } catch (err) {
        console.error('Error saat registrasi:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat registrasi.'
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const identifier = (req.body.username || req.body.email || '').toString().trim();
        const password = (req.body.password || '').toString();

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username/Email dan kata sandi wajib diisi.'
            });
        }

        const loginIdentifier = identifier.toLowerCase();
        const [users] = await pool.query(
            'SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ? LIMIT 1',
            [loginIdentifier, loginIdentifier]
        );
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Username/Email atau kata sandi yang Anda masukkan salah.'
            });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Username/Email atau kata sandi yang Anda masukkan salah.'
            });
        }

        const userData = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        };

        const token = generateToken(userData);

        return res.json({
            success: true,
            message: 'Login berhasil!',
            data: {
                user: userData,
                token
            }
        });
    } catch (err) {
        console.error('Error saat login:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat login.'
        });
    }
};

// Get current user profile
exports.getMe = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, username, email, phone, headline, bio, created_at FROM users WHERE id = ?', 
            [req.user.id]
        );
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan.'
            });
        }

        return res.json({
            success: true,
            data: users[0]
        });
    } catch (err) {
        console.error('Error saat mengambil profile:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data profil.'
        });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, username, email, phone, headline, bio } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nama lengkap dan email wajib diisi.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid.'
            });
        }

        // Validasi username jika disediakan
        if (username) {
            const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    success: false,
                    message: 'Username hanya boleh berisi huruf, angka, dan underscore (3-30 karakter).'
                });
            }
            // Cek apakah username sudah digunakan oleh user lain
            const [existingUsername] = await pool.query(
                'SELECT id FROM users WHERE username = ? AND id != ? LIMIT 1',
                [username.toLowerCase().trim(), userId]
            );
            if (existingUsername.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Username sudah digunakan oleh akun lain.'
                });
            }
        }

        // Cek apakah email sudah digunakan oleh user lain
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1',
            [email.toLowerCase().trim(), userId]
        );
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah digunakan oleh akun lain.'
            });
        }

        // Lakukan pembaruan
        await pool.query(
            'UPDATE users SET name = ?, username = COALESCE(?, username), email = ?, phone = ?, headline = ?, bio = ? WHERE id = ?',
            [
                name.trim(),
                username ? username.toLowerCase().trim() : null,
                email.toLowerCase().trim(),
                phone ? phone.trim() : null,
                headline ? headline.trim() : null,
                bio ? bio.trim() : null,
                userId
            ]
        );

        // Ambil data terbaru
        const [updatedRows] = await pool.query(
            'SELECT id, name, username, email, phone, headline, bio, created_at FROM users WHERE id = ?',
            [userId]
        );
        const updatedUser = updatedRows[0];
        const newToken = generateToken(updatedUser);

        return res.json({
            success: true,
            message: 'Profil berhasil diperbarui.',
            data: {
                user: updatedUser,
                token: newToken
            }
        });
    } catch (err) {
        console.error('Error saat memperbarui profil:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat memperbarui profil.'
        });
    }
};

// Update Password
exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Kata sandi saat ini dan kata sandi baru wajib diisi.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Kata sandi baru minimal harus 6 karakter.'
            });
        }

        // Ambil kata sandi ter-hash saat ini
        const [rows] = await pool.query('SELECT password FROM users WHERE id = ? LIMIT 1', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan.'
            });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Kata sandi saat ini tidak cocok.'
            });
        }

        // Hash kata sandi baru
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

        return res.json({
            success: true,
            message: 'Kata sandi berhasil diperbarui.'
        });
    } catch (err) {
        console.error('Error saat memperbarui password:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat mengubah kata sandi.'
        });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan.'
            });
        }

        return res.json({
            success: true,
            message: 'Akun dan seluruh data Anda telah berhasil dihapus secara permanen.'
        });
    } catch (err) {
        console.error('Error saat menghapus akun:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat menghapus akun.'
        });
    }
};

// Forgot Password - Menghasilkan kode OTP 6 digit dan mengirim email
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Alamat email wajib diisi.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid.'
            });
        }

        // Cari user berdasarkan email
        const [users] = await pool.query(
            'SELECT id, name, email FROM users WHERE LOWER(email) = ? LIMIT 1',
            [email.toLowerCase().trim()]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email tersebut tidak terdaftar di sistem QuickVitae.'
            });
        }

        const user = users[0];

        // Buat Kode Verifikasi 6 Digit Angka (contoh: 849201)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Masa berlaku kode OTP: 15 menit dari sekarang
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

        // Simpan kode OTP ke database
        await pool.query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [otpCode, expiresAt, user.id]
        );

        // Kirim email reset password dengan kode OTP secara background / non-blocking
        // Ini memastikan respon API kembali instan (<200ms) tanpa terblokir oleh timeout jaringan SMTP
        const clientOrigin = req.get('origin') || process.env.CLIENT_URL || 'https://cv-generator-ai-zeta.vercel.app';
        sendResetPasswordEmail(user.email, user.name, otpCode, clientOrigin)
            .then(mailResult => {
                if (mailResult?.previewUrl) console.log('Mail sent, preview URL:', mailResult.previewUrl);
            })
            .catch(err => {
                console.warn('Background mailer notice (safe fallback):', err.message);
            });

        return res.json({
            success: true,
            message: 'Kode verifikasi 6 digit telah berhasil dibuat dan dikirimkan.',
            email: user.email,
            otpCode: otpCode // Menjamin pengguna dapat melihat/memakai kode verifikasi seketika
        });
    } catch (err) {
        console.error('Error pada forgotPassword:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat memproses permintaan reset kata sandi.'
        });
    }
};

// Reset Password - Mengatur kata sandi baru berdasarkan kode OTP 6 digit atau token
exports.resetPassword = async (req, res) => {
    try {
        const { email, otpCode, token, newPassword } = req.body;
        const verificationCode = (otpCode || token || '').toString().trim();

        if (!verificationCode || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Kode verifikasi 6 digit dan kata sandi baru wajib disertakan.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Kata sandi baru minimal harus 6 karakter.'
            });
        }

        // Cari user yang memiliki kode verifikasi yang cocok dan belum kedaluwarsa
        let query = 'SELECT id, name, email FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()';
        let params = [verificationCode];

        if (email) {
            query += ' AND LOWER(email) = ?';
            params.push(email.toLowerCase().trim());
        }

        const [users] = await pool.query(query + ' LIMIT 1', params);

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Kode verifikasi salah atau telah kedaluwarsa. Silakan periksa kembali atau minta kode baru.'
            });
        }

        const user = users[0];

        // Hash kata sandi baru
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password dan kosongkan reset token
        await pool.query(
            'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        return res.json({
            success: true,
            message: 'Kata sandi Anda berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.'
        });
    } catch (err) {
        console.error('Error pada resetPassword:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat mereset kata sandi.'
        });
    }
};
