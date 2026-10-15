import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Edit3, 
  Eye, 
  Trash2, 
  Clock, 
  Download, 
  Layers, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cvService } from '../services/cvService';
import { getFullImageUrl } from '../utils/imageUrl';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Modal Buat CV
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('Curriculum Vitae');
  const [newTemplate, setNewTemplate] = useState('modern');
  const [creating, setCreating] = useState(false);

  // Modal Konfirmasi Hapus CV
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const res = await cvService.getUserCVs();
      if (res.success) {
        setCvList(res.data);
      }
    } catch (err) {
      setToast({ message: 'Gagal memuat daftar CV Anda.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const handleCreateCV = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await cvService.createCV({
        title: newTitle,
        template_id: newTemplate
      });
      if (res.success) {
        setCreateModalOpen(false);
        navigate(`/cv/edit/${res.data.id}`);
      }
    } catch (err) {
      setToast({ message: 'Gagal membuat CV baru.', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!selectedCV) return;
    try {
      setDeleting(true);
      const res = await cvService.deleteCV(selectedCV.id);
      if (res.success) {
        setDeleteModalOpen(false);
        setSelectedCV(null);
        setToast({ message: 'CV berhasil dihapus!', type: 'success' });
        fetchCVs();
      }
    } catch (err) {
      setToast({ message: 'Gagal menghapus CV.', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card-light p-6 rounded-2xl mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs mb-1">
              <FolderOpen className="w-4 h-4" />
              <span>Dashboard Manajemen Dokumen</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Halo, {user?.name || 'Pengguna'}! 👋
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Kelola seluruh dokumen lamaran kerja dan riwayat hidup Anda di sini.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 brand-btn font-bold rounded-xl text-xs shadow-brand transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat CV Baru</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card-light card-light-hover p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Total Dokumen CV
              </p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{cvList.length}</p>
            </div>
          </div>

          <div className="card-light card-light-hover p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Pilihan Template
              </p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">3 Pilihan</p>
            </div>
          </div>

          <div className="card-light card-light-hover p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Format Ekspor
              </p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">PDF A4 & Cetak</p>
            </div>
          </div>
        </div>

        {/* Daftar CV */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Daftar Dokumen CV</h2>
        </div>

        {loading ? (
          <div className="text-center py-16 card-light rounded-2xl">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Memuat berkas CV...</p>
          </div>
        ) : cvList.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 card-light rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Belum Ada Dokumen CV</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Anda belum membuat dokumen CV. Buat CV pertama Anda sekarang untuk memulai lamaran kerja!
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 brand-btn font-bold rounded-xl text-xs shadow-brand transition"
            >
              <Plus className="w-4 h-4" />
              <span>Buat CV Pertama Saya</span>
            </button>
          </div>
        ) : (
          /* Grid CV Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvList.map((item) => (
              <div
                key={item.id}
                className="card-light card-light-hover rounded-2xl flex flex-col justify-between overflow-hidden group transition-all duration-200"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {item.photo_url ? (
                        <img
                          src={getFullImageUrl(item.photo_url)}
                          alt={item.full_name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-sm">
                          {item.full_name ? item.full_name.charAt(0).toUpperCase() : 'CV'}
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate max-w-[170px]">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                          {item.full_name || 'Tanpa Nama'} {item.job_title ? `• ${item.job_title}` : ''}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-full uppercase border border-slate-200 flex-shrink-0">
                      {item.template_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Diperbarui: {formatDate(item.updated_at)}</span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/cv/edit/${item.id}`}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 hover:bg-slate-200/60 px-2.5 py-1.5 rounded-lg transition"
                      title="Edit CV"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <Link
                      to={`/cv/preview/${item.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition"
                      title="Preview & Download"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCV(item);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Hapus CV"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Buat CV Baru */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Buat Dokumen CV Baru"
      >
        <form onSubmit={handleCreateCV} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Judul CV <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: CV Software Engineer / CV Lamaran Magang"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Desain Template Awal
            </label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <label
                className={`p-3 border rounded-xl cursor-pointer text-center text-xs transition ${
                  newTemplate === 'modern'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value="modern"
                  checked={newTemplate === 'modern'}
                  onChange={() => setNewTemplate('modern')}
                  className="hidden"
                />
                Modern
              </label>

              <label
                className={`p-3 border rounded-xl cursor-pointer text-center text-xs transition ${
                  newTemplate === 'professional'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value="professional"
                  checked={newTemplate === 'professional'}
                  onChange={() => setNewTemplate('professional')}
                  className="hidden"
                />
                Professional
              </label>

              <label
                className={`p-3 border rounded-xl cursor-pointer text-center text-xs transition ${
                  newTemplate === 'minimalist'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value="minimalist"
                  checked={newTemplate === 'minimalist'}
                  onChange={() => setNewTemplate('minimalist')}
                  className="hidden"
                />
                Minimalist
              </label>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Anda tetap dapat berganti template kapan saja tanpa kehilangan data riwayat hidup.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 text-xs brand-btn rounded-lg font-bold shadow-brand transition"
            >
              {creating ? 'Membuat...' : 'Buat CV'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Hapus CV */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Penghapusan CV"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Hapus dokumen "{selectedCV?.title}"?
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Tindakan ini permanen. Seluruh data riwayat pendidikan, pengalaman, dan keahlian di dalamnya akan dihapus.
          </p>

          <div className="flex justify-center gap-2 mt-5">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg font-medium transition"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDeleteCV}
              className="px-5 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-sm transition"
            >
              {deleting ? 'Menghapus...' : 'Ya, Hapus CV'}
            </button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default DashboardPage;
