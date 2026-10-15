import React, { useState } from 'react';
import { Upload, X, User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { cvService } from '../../services/cvService';
import { getFullImageUrl } from '../../utils/imageUrl';

const PersonalForm = ({ data, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const p = data?.personal_information || {};

  const handleFieldChange = (field, value) => {
    onChange('personal_information', {
      ...p,
      [field]: value
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran foto terlalu besar! Maksimal 2 MB.');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Format berkas tidak valid! Hanya JPEG, PNG, dan WebP.');
      return;
    }

    try {
      setError('');
      setUploading(true);
      const res = await cvService.uploadPhoto(file);
      if (res.success) {
        handleFieldChange('photo_url', res.data.url);
      }
    } catch (err) {
      setError('Gagal mengunggah foto. Silakan coba kembali.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    handleFieldChange('photo_url', '');
  };

  return (
    <div className="space-y-4">
      {/* Upload Foto */}
      <div className="flex items-center gap-5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="relative">
          {p.photo_url ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary-500 shadow-sm">
              <img
                src={getFullImageUrl(p.photo_url)}
                alt="Foto Profil"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
                title="Hapus foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-300">
              <User className="w-10 h-10" />
            </div>
          )}
        </div>
        <div>
          <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition">
            <Upload className="w-3.5 h-3.5 text-white" />
            <span>{uploading ? 'Mengunggah...' : 'Unggah Foto'}</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-[11px] text-slate-500 mt-1">
            Format JPG, PNG, atau WebP. Ukuran maks. 2 MB.
          </p>
          {error && <p className="text-[11px] text-red-600 font-medium mt-1">{error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={p.full_name || ''}
            onChange={(e) => handleFieldChange('full_name', e.target.value)}
            placeholder="Contoh: Budi Santoso, S.Kom."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Profesi / Target Posisi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={p.job_title || ''}
            onChange={(e) => handleFieldChange('job_title', e.target.value)}
            placeholder="Contoh: Full Stack Web Developer"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={p.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="nama@email.com"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={p.phone || ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="+62 812-3456-7890"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kota Domisili <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={p.city || ''}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            placeholder="Contoh: Jakarta Selatan"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Alamat Lengkap
          </label>
          <input
            type="text"
            value={p.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            placeholder="Jl. Merdeka No. 45"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={p.linkedin_url || ''}
            onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            value={p.github_url || ''}
            onChange={(e) => handleFieldChange('github_url', e.target.value)}
            placeholder="https://github.com/username"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Website / Portofolio URL
          </label>
          <input
            type="url"
            value={p.portfolio_url || ''}
            onChange={(e) => handleFieldChange('portfolio_url', e.target.value)}
            placeholder="https://myportfolio.com"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalForm;
