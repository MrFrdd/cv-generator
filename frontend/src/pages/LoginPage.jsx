import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, AtSign, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setToast({ message: 'Username dan password wajib diisi!', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await login(username, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal. Periksa kembali username dan password Anda.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 relative">
      <div className="w-full max-w-md card-light rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl brand-btn flex items-center justify-center mx-auto mb-3 shadow-brand text-white">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Masuk ke QuickVitae</h1>
          <p className="text-xs text-slate-500 mt-1">
            Lanjutkan pengelolaan dan pencetakan dokumen CV Anda
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username_anda"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Belum memiliki akun?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition">
            Daftar Akun Baru
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

export default LoginPage;
