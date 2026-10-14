import React from 'react';
import { Plus, Trash2, Globe2 } from 'lucide-react';

const LanguageForm = ({ data, onChange }) => {
  const languages = data?.languages || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    onChange('languages', updated);
  };

  const handleAdd = () => {
    onChange('languages', [
      ...languages,
      {
        language_name: '',
        proficiency: 'Lancar (Fluent)'
      }
    ]);
  };

  const handleRemove = (index) => {
    const updated = languages.filter((_, i) => i !== index);
    onChange('languages', updated);
  };

  return (
    <div className="space-y-4">
      {languages.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <Globe2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-3">Belum ada bahasa yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Bahasa
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {languages.map((lang, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={lang.language_name || ''}
                  onChange={(e) => handleItemChange(idx, 'language_name', e.target.value)}
                  placeholder="Contoh: Bahasa Indonesia / Bahasa Inggris"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={lang.proficiency || ''}
                  onChange={(e) => handleItemChange(idx, 'proficiency', e.target.value)}
                  placeholder="Tingkat (Contoh: Penutur Asli / TOEFL 550)"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2.5 border-2 border-dashed border-blue-400 hover:border-blue-600 text-blue-700 bg-blue-50/80 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" /> Tambah Bahasa Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageForm;
