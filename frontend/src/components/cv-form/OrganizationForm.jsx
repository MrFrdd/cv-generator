import React from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

const OrganizationForm = ({ data, onChange }) => {
  const organizations = data?.organizations || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...organizations];
    updated[index] = { ...updated[index], [field]: value };
    onChange('organizations', updated);
  };

  const handleAdd = () => {
    onChange('organizations', [
      ...organizations,
      {
        organization_name: '',
        role: '',
        period: '',
        description: ''
      }
    ]);
  };

  const handleRemove = (index) => {
    const updated = organizations.filter((_, i) => i !== index);
    onChange('organizations', updated);
  };

  return (
    <div className="space-y-4">
      {organizations.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-3">Belum ada pengalaman organisasi yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Organisasi
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {organizations.map((org, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700">Organisasi #{idx + 1}</span>
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
                    Nama Organisasi / Komunitas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={org.organization_name || ''}
                    onChange={(e) => handleItemChange(idx, 'organization_name', e.target.value)}
                    placeholder="Contoh: Himpunan Mahasiswa Informatika"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jabatan / Posisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={org.role || ''}
                    onChange={(e) => handleItemChange(idx, 'role', e.target.value)}
                    placeholder="Contoh: Ketua Divisi IT"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Periode Menjabat
                  </label>
                  <input
                    type="text"
                    value={org.period || ''}
                    onChange={(e) => handleItemChange(idx, 'period', e.target.value)}
                    placeholder="Contoh: 2022 - 2023"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Deskripsi Aktivitas & Pencapaian
                  </label>
                  <textarea
                    rows={2}
                    value={org.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Jelaskan peran aktif, program kerja yang berhasil dijalankan, atau kepemimpinan Anda..."
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
            <Plus className="w-4 h-4" /> Tambah Pengalaman Organisasi Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationForm;
