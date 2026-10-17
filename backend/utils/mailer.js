const nodemailer = require('nodemailer');
require('dotenv').config();

// Buat transporter berdasarkan konfigurasi environment
const createTransporter = async () => {
    // 1. Jika ada kredensial SMTP nyata yang dikonfigurasi
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true', // true untuk port 465, false untuk 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    // 2. Fallback Mode Development: Buat Ethereal Test Account otomatis
    // Ini memungkinkan testing reset password langsung bekerja tanpa konfigurasi SMTP manual
    try {
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    } catch (err) {
        console.warn('Gagal membuat test mail account, menggunakan fallback console log:', err.message);
        return null;
    }
};

/**
 * Mengirimkan email instruksi Reset Kata Sandi
 * @param {string} toEmail Alamat email tujuan
 * @param {string} userName Nama pengguna
 * @param {string} resetToken Token unik reset
 */
const sendResetPasswordEmail = async (toEmail, userName, resetToken, originUrl = null) => {
    const clientUrl = originUrl || process.env.CLIENT_URL || 'https://cv-generator-ai-zeta.vercel.app';
    const resetUrl = `${clientUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
            .content { padding: 32px 28px; line-height: 1.6; font-size: 14px; }
            .content h2 { margin-top: 0; font-size: 18px; color: #0f172a; }
            .btn-container { text-align: center; margin: 30px 0; }
            .btn { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: #ffffff !important; text-decoration: none; padding: 12px 32px; border-radius: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
            .link-box { background: #f1f5f9; padding: 12px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 12px; color: #475569; margin: 16px 0; }
            .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>QuickVitae</h1>
                <p>Platform Pembuatan Dokumen CV Profesional</p>
            </div>
            <div class="content">
                <h2>Permintaan Reset Kata Sandi</h2>
                <p>Halo <strong>${userName || 'Pengguna'}</strong>,</p>
                <p>Kami menerima permintaan untuk mereset kata sandi akun QuickVitae Anda yang terdaftar dengan email <strong>${toEmail}</strong>.</p>
                <p>Silakan klik tombol di bawah ini untuk mengatur kata sandi baru Anda:</p>
                
                <div class="btn-container">
                    <a href="${resetUrl}" class="btn" target="_blank">Reset Kata Sandi Sekarang</a>
                </div>

                <p style="font-size: 12px; color: #64748b;">Tautan ini hanya berlaku selama <strong>1 jam</strong>. Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini dan akun Anda akan tetap aman.</p>
                
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                <p style="font-size: 12px; color: #64748b; margin-bottom: 6px;">Jika tombol di atas tidak dapat diklik, salin dan tempel URL berikut ke peramban web Anda:</p>
                <div class="link-box">${resetUrl}</div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} QuickVitae. Seluruh hak cipta dilindungi.
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const transporter = await createTransporter();
        if (!transporter) {
            console.log('\n================== [RESET PASSWORD LINK] ==================');
            console.log(`Tujuan: ${toEmail}`);
            console.log(`URL Reset: ${resetUrl}`);
            console.log('===========================================================\n');
            return { success: true, previewUrl: resetUrl };
        }

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"QuickVitae Security" <no-reply@quickvitae.com>',
            to: toEmail,
            subject: 'Reset Kata Sandi Akun QuickVitae Anda',
            html: htmlContent
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log('\n📧 [Ethereal Mail Preview URL]:', previewUrl);
        }
        console.log(`✓ Email reset kata sandi terkirim ke ${toEmail} (ID: ${info.messageId})`);
        return { success: true, previewUrl: previewUrl || resetUrl };
    } catch (err) {
        console.error('Gagal mengirim email reset password:', err);
        // Tetap log URL ke console agar developer tidak terblokir
        console.log('\n================== [FALLBACK RESET LINK] ==================');
        console.log(`URL Reset: ${resetUrl}`);
        console.log('===========================================================\n');
        return { success: false, error: err.message, fallbackUrl: resetUrl };
    }
};

module.exports = {
    sendResetPasswordEmail
};
