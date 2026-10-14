exports.uploadPhoto = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada berkas yang diunggah.'
            });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        return res.json({
            success: true,
            message: 'Foto berhasil diunggah!',
            data: {
                filename: req.file.filename,
                url: fileUrl
            }
        });
    } catch (err) {
        console.error('Error saat upload berkas:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengunggah foto.'
        });
    }
};
