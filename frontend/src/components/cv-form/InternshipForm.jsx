import React from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';

const InternshipForm = ({ data, onChange }) => {
  const internships = data?.internships || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...internships];
    updated[index] = { ...updated[index], [field]: value };
    onChange('internships', updated);
  };

  const handleAdd = () => {
    onChange('internships', [
      ...internships,
      {
        company: '',
        position: '',
        period: '',
        description: ''
      }
    ]);
  };

  const handleRemove = (index) => {
    const updated = internships.filter((_, i) => i !== index);
    onChange('internships', updated);
  };

  return (
    <div className="space-y-4">
      {internships.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-3">Belum ada pengalaman magang/internship yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Pengalaman Magang
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map((intern, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700">Magang #{idx + 1}</span>
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
                    Nama Perusahaan / Instansi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={intern.company || ''}
                    onChange={(e) => handleItemChange(idx, 'company', e.target.value)}
                    placeholder="Contoh: PT Inovasi Digital"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Posisi Magang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={intern.position || ''}
                    onChange={(e) => handleItemChange(idx, 'position', e.target.value)}
                    placeholder="Contoh: UI/UX Designer Intern"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Periode & Durasi
                  </label>
                  <input
                    type="text"
                    value={intern.period || ''}
                    onChange={(e) => handleItemChange(idx, 'period', e.target.value)}
                    placeholder="Contoh: Feb 2024 - Agu 2024 (6 Bulan)"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Deskripsi Tugas & Hasil Pekerjaan
                  </label>
                  <textarea
                    rows={2}
                    value={intern.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Jelaskan kontribusi Anda selama program magang..."
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none leading-relaxed"
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
            <Plus className="w-4 h-4" /> Tambah Pengalaman Magang Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default InternshipForm;
