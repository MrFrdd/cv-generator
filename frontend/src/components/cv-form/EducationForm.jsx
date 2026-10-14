import React from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

const EducationForm = ({ data, onChange }) => {
  const educations = data?.educations || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    onChange('educations', updated);
  };

  const handleAdd = () => {
    onChange('educations', [
      ...educations,
      {
        institution: '',
        degree: 'Sarjana (S1)',
        major: '',
        start_year: '',
        end_year: '',
        gpa: '',
        description: ''
      }
    ]);
  };

  const handleRemove = (index) => {
    const updated = educations.filter((_, i) => i !== index);
    onChange('educations', updated);
  };

  return (
    <div className="space-y-4">
      {educations.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-3">Belum ada riwayat pendidikan yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Pendidikan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700">Pendidikan #{idx + 1}</span>
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
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nama Institusi / Universitas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => handleItemChange(idx, 'institution', e.target.value)}
                    placeholder="Contoh: Universitas Indonesia"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jenjang Pendidikan
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => handleItemChange(idx, 'degree', e.target.value)}
                    placeholder="Contoh: Sarjana (S1) / Diploma (D3)"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jurusan / Program Studi
                  </label>
                  <input
                    type="text"
                    value={edu.major || ''}
                    onChange={(e) => handleItemChange(idx, 'major', e.target.value)}
                    placeholder="Contoh: Teknik Informatika"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nilai Akhir / IPK
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => handleItemChange(idx, 'gpa', e.target.value)}
                    placeholder="Contoh: 3.82 / 4.00"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tahun Mulai
                  </label>
                  <input
                    type="text"
                    value={edu.start_year || ''}
                    onChange={(e) => handleItemChange(idx, 'start_year', e.target.value)}
                    placeholder="Contoh: 2020"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tahun Selesai (atau 'Sekarang')
                  </label>
                  <input
                    type="text"
                    value={edu.end_year || ''}
                    onChange={(e) => handleItemChange(idx, 'end_year', e.target.value)}
                    placeholder="Contoh: 2024"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Keterangan Tambahan / Judul Skripsi
                  </label>
                  <textarea
                    rows={2}
                    value={edu.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Fokus skripsi atau aktivitas akademik penting..."
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
            <Plus className="w-4 h-4" /> Tambah Pendidikan Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default EducationForm;
