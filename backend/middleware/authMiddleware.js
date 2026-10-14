const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_academic_waterfall_2026_cvgen');
        req.user = decoded; // { id, email }
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid atau sudah kedaluwarsa.'
        });
    }
};

module.exports = authMiddleware;
