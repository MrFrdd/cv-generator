import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import Toast from '../components/common/Toast';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [otpCode, setOtpCode] = useState(urlToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanCode = (otpCode || urlToken).trim();
    if (!cleanCode) {
      setToast({ message: 'Kode verifikasi 6 digit wajib diisi!', type: 'error' });
      return;
    }

    if (!newPassword || !confirmPassword) {
      setToast({ message: 'Semua kolom kata sandi wajib diisi!', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: 'Kata sandi baru minimal harus 6 karakter.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ message: 'Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword({ 
        token: cleanCode, 
        otpCode: cleanCode,
        newPassword 
      });
      if (res.success) {
        setSuccess(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengatur ulang kata sandi. Kode verifikasi mungkin salah atau telah kedaluwarsa.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 relative">
      <div className="w-full max-w-md card-light rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl brand-btn flex items-center justify-center mx-auto mb-3 shadow-brand text-white">
            {success ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {success ? 'Kata Sandi Diperbarui!' : 'Atur Kata Sandi Baru'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {success 
              ? 'Kata sandi baru Anda telah aktif. Silakan masuk ke akun Anda.' 
              : 'Masukkan kode verifikasi dan buat kata sandi baru untuk akun Anda'}
          </p>
        </div>

        {success ? (
          /* Success Screen */
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kata Sandi Berhasil Diperbarui!</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Kata sandi baru Anda telah aktif. Silakan masuk menggunakan kata sandi baru tersebut.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 brand-btn text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-brand transition inline-flex"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Form Reset Password */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Kode Verifikasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kode Verifikasi (6 Digit / Token)
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Masukkan kode verifikasi 6 digit"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Input Sandi Baru */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition p-0.5"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Sandi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition p-0.5"
                  title={showConfirm ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 brand-btn text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-brand transition disabled:opacity-60 mt-3"
            >
              <span>{loading ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4 flex items-center justify-between">
          <Link to="/forgot-password" className="font-semibold text-blue-600 hover:text-blue-700 transition inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Minta Kode Baru</span>
          </Link>
          <Link to="/login" className="font-semibold text-slate-600 hover:text-slate-800 transition">
            Kembali ke Masuk
          </Link>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />
    </div>
  );
};

export default ResetPasswordPage;
