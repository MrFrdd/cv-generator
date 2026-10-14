import React, { useState } from 'react';
import { Plus, X, Wrench, HeartHandshake } from 'lucide-react';

const SkillsForm = ({ data, onChange }) => {
  const skills = data?.skills || [];
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState('hard');
  const [newLevel, setNewLevel] = useState('Intermediate');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    onChange('skills', [
      ...skills,
      {
        skill_name: newSkillName.trim(),
        category: newCategory,
        level: newLevel
      }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange('skills', updated);
  };

  const hardSkills = skills.filter((s) => s.category === 'hard' || !s.category);
  const softSkills = skills.filter((s) => s.category === 'soft');

  return (
    <div className="space-y-5">
      {/* Form Tambah Skill */}
      <form onSubmit={handleAddSkill} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
        <span className="text-xs font-bold text-slate-700 block mb-2">Tambah Keterampilan Baru</span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nama Keterampilan / Skill
            </label>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Contoh: React.js / Problem Solving"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kategori
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="hard">Hard Skill (Teknis)</option>
              <option value="soft">Soft Skill (Interpersonal)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Level
            </label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="Beginner">Pemula</option>
              <option value="Intermediate">Menengah</option>
              <option value="Advanced">Mahir</option>
              <option value="Expert">Ahli</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
        </div>
      </form>

      {/* Daftar Hard Skills */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
          <Wrench className="w-3.5 h-3.5 text-primary-600" />
          <span>Hard Skills (Teknis)</span>
          <span className="text-[10px] text-slate-500 font-normal">({hardSkills.length})</span>
        </div>
        {hardSkills.length === 0 ? (
          <p className="text-[11px] text-slate-400 italic">Belum ada hard skill yang ditambahkan.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => {
              if (s.category === 'soft') return null;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-md text-xs text-slate-800"
                >
                  <span className="font-medium">{s.skill_name}</span>
                  <span className="text-[10px] text-primary-700 bg-primary-50 px-1 rounded">
                    {s.level || 'Intermediate'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Daftar Soft Skills */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
          <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
          <span>Soft Skills (Interpersonal)</span>
          <span className="text-[10px] text-slate-500 font-normal">({softSkills.length})</span>
        </div>
        {softSkills.length === 0 ? (
          <p className="text-[11px] text-slate-400 italic">Belum ada soft skill yang ditambahkan.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => {
              if (s.category !== 'soft') return null;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900"
                >
                  <span className="font-medium">{s.skill_name}</span>
                  <span className="text-[10px] text-amber-700 bg-white px-1 rounded">
                    {s.level || 'Intermediate'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-amber-500 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;
