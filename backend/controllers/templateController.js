const pool = require('../config/database');

exports.getAllTemplates = async (req, res) => {
    try {
        const [templates] = await pool.query('SELECT * FROM templates ORDER BY name ASC');
        return res.json({
            success: true,
            data: templates
        });
    } catch (err) {
        console.error('Error saat mengambil templates:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil daftar template CV.'
        });
    }
};

exports.getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const [templates] = await pool.query('SELECT * FROM templates WHERE id = ?', [id]);
        if (templates.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Template tidak ditemukan.'
            });
        }
        return res.json({
            success: true,
            data: templates[0]
        });
    } catch (err) {
        console.error('Error saat mengambil template:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil template CV.'
        });
    }
};
