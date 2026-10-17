import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Lock, Eye, EyeOff, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';
import { authService } from '../services/authService';
import Toast from '../components/common/Toast';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // Step states: 1 = Input Email, 2 = Input OTP & Password Baru, 3 = Sukses
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Helper & UI states
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverOtp, setServerOtp] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  // Handle Step 1: Submit Email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setToast({ message: 'Silakan masukkan alamat email akun Anda!', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword({ email: cleanEmail });
      if (res.success) {
        if (res.otpCode) {
          setServerOtp(res.otpCode);
          setOtpCode(res.otpCode); // Otomatis isikan agar mempermudah pengguna
        }
        if (res.previewUrl) {
          setPreviewUrl(res.previewUrl);
        }
        setStep(2);
        setToast({ 
          message: 'Kode verifikasi telah dibuat! Silakan masukkan kode verifikasi dan kata sandi baru Anda.', 
          type: 'success' 
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memproses permintaan reset kata sandi. Silakan periksa kembali email Anda.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP Code
  const handleResendOtp = async () => {
    if (!email) return;
    try {
      setResending(true);
      const res = await authService.forgotPassword({ email: email.trim() });
      if (res.success) {
        if (res.otpCode) {
          setServerOtp(res.otpCode);
          setOtpCode(res.otpCode);
        }
        if (res.previewUrl) {
          setPreviewUrl(res.previewUrl);
        }
        setToast({ message: 'Kode verifikasi baru berhasil dibuat dan dikirim!', type: 'success' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengirim ulang kode verifikasi.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setResending(false);
    }
  };

  // Handle Step 2: Submit OTP & New Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    const cleanOtp = otpCode.trim();
    if (!cleanOtp) {
      setToast({ message: 'Silakan masukkan 6 digit kode verifikasi Anda!', type: 'error' });
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
        email: email.trim(),
        otpCode: cleanOtp,
        newPassword
      });

      if (res.success) {
        setStep(3);
        setToast({ message: 'Kata sandi Anda telah berhasil diperbarui!', type: 'success' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengatur ulang kata sandi. Periksa kode verifikasi Anda atau minta kode baru.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 relative">
      <div className="w-full max-w-md card-light rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Brand Icon Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl brand-btn flex items-center justify-center mx-auto mb-3 shadow-brand text-white">
            {step === 3 ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : step === 2 ? (
              <ShieldCheck className="w-6 h-6 text-white" />
            ) : (
              <KeyRound className="w-6 h-6 text-white" />
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {step === 3
              ? 'Kata Sandi Diperbarui!'
              : step === 2
              ? 'Verifikasi & Kata Sandi Baru'
              : 'Lupa Kata Sandi?'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {step === 3
              ? 'Akun Anda telah diamankan dengan kata sandi baru.'
              : step === 2
              ? `Masukkan kode verifikasi 6 digit yang dikirimkan ke ${email} dan atur kata sandi baru Anda.`
              : 'Masukkan alamat email yang terdaftar untuk menerima kode verifikasi pemulihan kata sandi.'}
          </p>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-blue-600' : 'w-4 bg-blue-200'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-blue-600' : 'w-4 bg-slate-200'}`} />
          </div>
        )}

        {/* STEP 1: Masukkan Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Email Akun Anda
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 brand-btn text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-brand transition disabled:opacity-60 mt-3"
            >
              <span>{loading ? 'Memproses Permintaan...' : 'Lanjutkan ke Verifikasi'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Input Kode OTP & Kata Sandi Baru */}
        {step === 2 && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            {/* Box Highlight Kode OTP */}
            {serverOtp && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Kode Verifikasi Anda:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(serverOtp)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between bg-white border border-blue-100 rounded-lg px-3 py-2">
                  <span className="font-mono text-base font-bold tracking-widest text-blue-700">
                    {serverOtp}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Berlaku 15 menit
                  </span>
                </div>
              </div>
            )}

            {/* Input Kode Verifikasi */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Kode Verifikasi (6 Digit)
                </label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 transition"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>{resending ? 'Mengirim...' : 'Kirim Ulang'}</span>
                </button>
              </div>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Contoh: 123456"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold tracking-wider bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Input Kata Sandi Baru */}
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
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Kata Sandi Baru */}
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
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Ganti Email
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 px-4 brand-btn text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-brand transition disabled:opacity-60"
              >
                <span>{loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Sukses */}
        {step === 3 && (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">Kata Sandi Berhasil Diperbarui!</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Kata sandi baru untuk akun <strong className="text-slate-900">{email}</strong> telah aktif. Silakan masuk dengan kata sandi baru Anda.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 brand-btn text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-brand transition"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Kembali ke Login */}
        {step !== 3 && (
          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Masuk</span>
            </Link>
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />
    </div>
  );
};

export default ForgotPasswordPage;
