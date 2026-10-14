import React from 'react';
import { Plus, Trash2, Trophy } from 'lucide-react';

const AchievementForm = ({ data, onChange }) => {
  const achievements = data?.achievements || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    onChange('achievements', updated);
  };

  const handleAdd = () => {
    onChange('achievements', [
      ...achievements,
      {
        title: '',
        issuer: '',
        year: '',
        description: ''
      }
    ]);
  };

  const handleRemove = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    onChange('achievements', updated);
  };

  return (
    <div className="space-y-4">
      {achievements.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-3">Belum ada prestasi / penghargaan yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Prestasi
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((ach, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700">Prestasi #{idx + 1}</span>
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
                    Nama Penghargaan / Prestasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ach.title || ''}
                    onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    placeholder="Contoh: Juara 2 Lomba Hackathon Nasional"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={ach.issuer || ''}
                    onChange={(e) => handleItemChange(idx, 'issuer', e.target.value)}
                    placeholder="Contoh: Kemendikbud / BEM Fakultas"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={ach.year || ''}
                    onChange={(e) => handleItemChange(idx, 'year', e.target.value)}
                    placeholder="Contoh: 2023"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={ach.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Jelaskan kompetisi atau karya yang mengantarkan Anda meraih prestasi ini..."
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
            <Plus className="w-4 h-4" /> Tambah Prestasi Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default AchievementForm;
