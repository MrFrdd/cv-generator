import React from 'react';
import { Plus, Trash2, FolderKanban } from 'lucide-react';

const ProjectForm = ({ data, onChange }) => {
  const projects = data?.projects || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange('projects', updated);
  };

  const handleAdd = () => {
    onChange('projects', [
      ...projects,
      {
        project_name: '',
        tech_stack: '',
        github_link: '',
        demo_link: '',
        description: ''
      }
    ]);
  };

  const handleRemove = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    onChange('projects', updated);
  };

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <FolderKanban className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-3">Belum ada proyek/portofolio yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Proyek
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700">Proyek #{idx + 1}</span>
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
                    Nama Proyek <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={proj.project_name || ''}
                    onChange={(e) => handleItemChange(idx, 'project_name', e.target.value)}
                    placeholder="Contoh: E-Commerce Web App"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Teknologi yang Digunakan (Tech Stack)
                  </label>
                  <input
                    type="text"
                    value={proj.tech_stack || ''}
                    onChange={(e) => handleItemChange(idx, 'tech_stack', e.target.value)}
                    placeholder="Contoh: React, Node.js, MySQL, Tailwind"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tautan Repository GitHub
                  </label>
                  <input
                    type="url"
                    value={proj.github_link || ''}
                    onChange={(e) => handleItemChange(idx, 'github_link', e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tautan Demo Online
                  </label>
                  <input
                    type="url"
                    value={proj.demo_link || ''}
                    onChange={(e) => handleItemChange(idx, 'demo_link', e.target.value)}
                    placeholder="https://project-demo.web.app"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Deskripsi Singkat & Fitur Utama Proyek
                  </label>
                  <textarea
                    rows={2}
                    value={proj.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Jelaskan tujuan aplikasi, arsitektur, dan fitur utama yang Anda implementasikan..."
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
            <Plus className="w-4 h-4" /> Tambah Proyek Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
