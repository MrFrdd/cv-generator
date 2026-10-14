import React from 'react';
import { Plus, Trash2, Award } from 'lucide-react';

const CertificationForm = ({ data, onChange }) => {
  const certifications = data?.certifications || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange('certifications', updated);
  };

  const handleAdd = () => {
    onChange('certifications', [
      ...certifications,
      {
        certificate_name: '',
        issuer: '',
        issue_year: '',
        credential_url: ''
      }
    ]);
  };

  const handleRemove = (index) => {
    const updated = certifications.filter((_, i) => i !== index);
    onChange('certifications', updated);
  };

  return (
    <div className="space-y-4">
      {certifications.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-3">Belum ada sertifikasi kompetensi yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Sertifikasi
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700">Sertifikasi #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                  title="Hapus item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nama Sertifikat / Lisensi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.certificate_name || ''}
                    onChange={(e) => handleItemChange(idx, 'certificate_name', e.target.value)}
                    placeholder="Contoh: Certified Full Stack Web Developer"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Lembaga Penerbit / Organisasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.issuer || ''}
                    onChange={(e) => handleItemChange(idx, 'issuer', e.target.value)}
                    placeholder="Contoh: Dicoding Indonesia / Google"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tahun Terbit
                  </label>
                  <input
                    type="text"
                    value={cert.issue_year || ''}
                    onChange={(e) => handleItemChange(idx, 'issue_year', e.target.value)}
                    placeholder="Contoh: 2024"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tautan Kredensial / Link Sertifikat
                  </label>
                  <input
                    type="url"
                    value={cert.credential_url || ''}
                    onChange={(e) => handleItemChange(idx, 'credential_url', e.target.value)}
                    placeholder="https://credential.net/verify/..."
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2.5 border-2 border-dashed border-blue-400 hover:border-blue-600 text-blue-700 bg-blue-50/80 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" /> Tambah Sertifikasi Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificationForm;
