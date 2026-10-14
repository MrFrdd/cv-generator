import React from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';

const ExperienceForm = ({ data, onChange }) => {
  const experiences = data?.work_experiences || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange('work_experiences', updated);
  };

  const handleAdd = () => {
    onChange('work_experiences', [
      ...experiences,
      {
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: 0,
        description: ''
      }
    ]);
  };

  const handleRemove = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    onChange('work_experiences', updated);
  };

  return (
    <div className="space-y-4">
      {experiences.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-3">Belum ada pengalaman kerja yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Pengalaman Kerja
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700">Pengalaman Kerja #{idx + 1}</span>
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
                    Nama Perusahaan / Organisasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => handleItemChange(idx, 'company', e.target.value)}
                    placeholder="Contoh: PT Solusi Teknologi Nusantara"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Posisi / Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.position || ''}
                    onChange={(e) => handleItemChange(idx, 'position', e.target.value)}
                    placeholder="Contoh: Frontend Developer"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Lokasi (Kota / Remote)
                  </label>
                  <input
                    type="text"
                    value={exp.location || ''}
                    onChange={(e) => handleItemChange(idx, 'location', e.target.value)}
                    placeholder="Contoh: Jakarta / Remote"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!exp.is_current}
                      onChange={(e) => handleItemChange(idx, 'is_current', e.target.checked ? 1 : 0)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Masih aktif bekerja di sini</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Bulan & Tahun Mulai
                  </label>
                  <input
                    type="text"
                    value={exp.start_date || ''}
                    onChange={(e) => handleItemChange(idx, 'start_date', e.target.value)}
                    placeholder="Contoh: Jan 2023"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Bulan & Tahun Selesai
                  </label>
                  <input
                    type="text"
                    value={exp.end_date || ''}
                    onChange={(e) => handleItemChange(idx, 'end_date', e.target.value)}
                    placeholder="Contoh: Des 2024"
                    disabled={!!exp.is_current}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Deskripsi Pekerjaan & Pencapaian
                  </label>
                  <textarea
                    rows={3}
                    value={exp.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Jelaskan tanggung jawab utama dan pencapaian terukur (contoh: Mengembangkan sistem X yang meningkatkan efisiensi sebesar 20%)..."
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
            <Plus className="w-4 h-4" /> Tambah Pengalaman Kerja Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
