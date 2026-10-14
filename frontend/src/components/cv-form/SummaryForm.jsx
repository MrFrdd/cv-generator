import React from 'react';

const SummaryForm = ({ data, onChange }) => {
  const cv = data?.cv || {};

  const handleFieldChange = (field, value) => {
    onChange('cv', {
      ...cv,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Judul Dokumen CV <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={cv.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Contoh: CV Software Engineer 2026"
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
          required
        />
        <p className="text-[11px] text-slate-500 mt-1">
          Judul ini memudahkan Anda membedakan versi CV pada dashboard.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Ringkasan Profesional / Profil Singkat (About Me)
        </label>
        <textarea
          rows={5}
          value={cv.summary || ''}
          onChange={(e) => handleFieldChange('summary', e.target.value)}
          placeholder="Tuliskan 2-4 kalimat yang merangkum latar belakang pendidikan, spesialisasi keahlian, pencapaian utama, dan tujuan karir Anda..."
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none leading-relaxed"
        />
        <p className="text-[11px] text-slate-500 mt-1">
          Tip: Gunakan kata kunci yang relevan dengan posisi yang dilamar untuk meningkatkan keterbacaan ATS.
        </p>
      </div>
    </div>
  );
};

export default SummaryForm;
