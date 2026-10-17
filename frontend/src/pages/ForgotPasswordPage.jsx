import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';
import Toast from '../components/common/Toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setToast({ message: 'Silakan masukkan alamat email akun Anda!', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword({ email });
      if (res.success) {
        setSubmitted(true);
        if (res.previewUrl) {
          setPreviewUrl(res.previewUrl);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memproses permintaan reset kata sandi. Silakan coba lagi.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 relative">
      <div className="w-full max-w-md card-light rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Brand Icon Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl brand-btn flex items-center justify-center mx-auto mb-3 shadow-brand text-white">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Lupa Kata Sandi?</h1>
          <p className="text-xs text-slate-500 mt-1">
            Masukkan alamat email yang terdaftar untuk menerima instruksi pemulihan kata sandi
          </p>
        </div>

        {!submitted ? (
          /* Form Input Email */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Email Terdaftar
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
              <span>{loading ? 'Mengirim Tautan...' : 'Kirim Tautan Pemulihan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Success Screen */
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">Periksa Kotak Masuk Anda</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Tautan pemulihan kata sandi telah dikirimkan ke <strong className="text-slate-900">{email}</strong>. 
                Tautan ini berlaku selama 1 jam.
              </p>
            </div>

            {previewUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-left">
                <p className="text-[11px] font-semibold text-blue-900 mb-1">
                  💡 Mode Pengujian Lokal / Preview:
                </p>
                <a
                  href={previewUrl}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline break-all"
                >
                  Buka Halaman Reset Kata Sandi Langsung &rarr;
                </a>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => { setSubmitted(false); setPreviewUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 transition underline"
              >
                Kirim ulang atau gunakan email lain
              </button>
            </div>
          </div>
        )}

        {/* Kembali ke Login */}
        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Masuk</span>
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

export default ForgotPasswordPage;
