import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Phone, 
  Briefcase, 
  FileText, 
  Save, 
  KeyRound, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  AtSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';
import Modal from '../components/common/Modal';

const ProfilePage = () => {
  const { user, updateProfile, updatePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'security' | 'danger'
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Form State: Informasi Profil
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    headline: user?.headline || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Sync profile form when user context updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        headline: user.headline || ''
      });
    }
  }, [user]);

  // Form State: Ganti Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Modal State: Hapus Akun
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Handle Update Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      const res = await updateProfile({
        name: profileForm.name,
        username: profileForm.username,
        email: profileForm.email,
        phone: profileForm.phone,
        headline: profileForm.headline
      });
      if (res.success) {
        setToast({
          message: res.message || 'Profil berhasil diperbarui!',
          type: 'success'
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal memperbarui profil.';
      setToast({
        message: errorMsg,
        type: 'error'
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Update Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      setToast({
        message: 'Password baru minimal harus 6 karakter.',
        type: 'error'
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({
        message: 'Konfirmasi password baru tidak cocok.',
        type: 'error'
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setToast({
          message: res.message || 'Password akun berhasil diubah!',
          type: 'success'
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal mengubah password.';
      setToast({
        message: errorMsg,
        type: 'error'
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'HAPUS') return;

    try {
      setIsDeletingAccount(true);
      const res = await deleteAccount();
      if (res.success) {
        navigate('/login');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal menghapus akun.';
      setToast({
        message: errorMsg,
        type: 'error'
      });
    } finally {
      setIsDeletingAccount(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Alert */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Profil Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20">
              {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Akun Aktif">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {profileForm.name || 'Pengguna QuickVitae'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 w-fit mx-auto sm:mx-0">
                <Sparkles className="w-3 h-3" /> Member QuickVitae
              </span>
            </div>
            <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <AtSign className="w-4 h-4 text-slate-400" />
              {profileForm.username || 'username'}
            </p>
            <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" />
              {profileForm.email || 'email@example.com'}
            </p>
            <p className="text-xs text-slate-400">
              Kelola informasi profil, preferensi data CV, dan pengaturan keamanan akun Anda.
            </p>
          </div>
        </div>

        {/* Tab & Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigasi Tab */}
          <div className="md:col-span-1 space-y-1 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm h-fit">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${
                activeTab === 'general'
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil & Biodata</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${
                activeTab === 'security'
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Keamanan Akun</span>
            </button>

            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${
                activeTab === 'danger'
                  ? 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm'
                  : 'text-slate-600 hover:bg-rose-50/50 hover:text-rose-600'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Zona Bahaya</span>
            </button>
          </div>

          {/* Konten Tab Utama */}
          <div className="md:col-span-3">
            {/* TAB 1: INFORMASI PROFIL & BIODATA */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Informasi Pribadi & Kontak</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data ini digunakan untuk identitas akun dan dapat dijadikan nilai baku (*auto-fill*) saat membuat dokumen CV baru.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Input Nama Lengkap */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          placeholder="Masukkan nama lengkap"
                          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Input Username */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Username
                      </label>
                      <div className="relative">
                        <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          placeholder="username_anda"
                          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Digunakan untuk login. Huruf, angka, underscore (3-30 karakter)</p>
                    </div>

                    {/* Input Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          placeholder="alamat@email.com"
                          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Input Nomor Telepon */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nomor Telepon / WhatsApp
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+62 812..."
                          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Input Headline / Profesi */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Headline / Gelar Profesional
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={profileForm.headline}
                          onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                          placeholder="e.g. Software Engineer / Akuntan"
                          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="brand-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-brand disabled:opacity-70 transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isUpdatingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: KEAMANAN & PASSWORD */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Ubah Kata Sandi (*Password*)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pastikan akun Anda tetap aman dengan menggunakan kata sandi unik minimal 6 karakter.
                  </p>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-800 text-xs">
                  <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Tips Keamanan Kata Sandi</p>
                    <p className="text-amber-700 mt-0.5 leading-relaxed">
                      Password Anda dienkripsi secara aman (hashing satu arah). Jangan pernah membagikan password Anda kepada siapapun, termasuk administrator.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                  {/* Password Saat Ini */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kata Sandi Saat Ini
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Baru */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Konfirmasi Password Baru */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Ulangi kata sandi baru"
                        className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="brand-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-brand disabled:opacity-70 transition"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isUpdatingPassword ? 'Mengubah...' : 'Ubah Kata Sandi'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: ZONA BAHAYA (HAPUS AKUN) */}
            {activeTab === 'danger' && (
              <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-7 shadow-sm space-y-6">
                <div>
                  <h2 className="text-base font-bold text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    Zona Berbahaya
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan. Berhati-hatilah saat melakukan penghapusan akun.
                  </p>
                </div>

                <div className="border border-rose-100 bg-rose-50/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Hapus Akun & Seluruh Data CV</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Semua dokumen CV, profil, dan riwayat yang Anda buat akan dihapus secara permanen dari server.
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Akun */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Penghapusan Akun"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p>
              Apakah Anda yakin? Seluruh dokumen CV dan informasi akun Anda akan terhapus selamanya dan tidak dapat dikembalikan.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Ketik kata <span className="font-bold text-rose-600">HAPUS</span> untuk mengonfirmasi:
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="HAPUS"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              disabled={deleteConfirmText !== 'HAPUS' || isDeletingAccount}
              onClick={handleDeleteAccount}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50 transition"
            >
              {isDeletingAccount ? 'Menghapus...' : 'Ya, Hapus Akun Saya'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
