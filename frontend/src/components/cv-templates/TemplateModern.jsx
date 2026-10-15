import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Code, Award, FolderKanban, Users } from 'lucide-react';
import { getFullImageUrl } from '../../utils/imageUrl';

const TemplateModern = ({ data }) => {
  const p = data?.personal_information || {};
  const cv = data?.cv || {};
  const educations = data?.educations || [];
  const experiences = data?.work_experiences || [];
  const internships = data?.internships || [];
  const organizations = data?.organizations || [];
  const skills = data?.skills || [];
  const certifications = data?.certifications || [];
  const languages = data?.languages || [];
  const achievements = data?.achievements || [];
  const projects = data?.projects || [];

  const hardSkills = skills.filter(s => s.category === 'hard' || !s.category);
  const softSkills = skills.filter(s => s.category === 'soft');

  return (
    <div className="a4-sheet font-sans text-slate-800 leading-normal text-xs grid grid-cols-12">
      {/* Sidebar Kiri (4 dari 12 Kolom) */}
      <div className="col-span-4 bg-slate-900 text-slate-100 px-5 py-6 flex flex-col justify-between">
        <div>
          {/* Avatar Profil */}
          <div className="flex flex-col items-center mb-6">
            {p.photo_url ? (
              <img
                src={getFullImageUrl(p.photo_url)}
                alt={p.full_name}
                className="w-28 h-28 object-cover rounded-full border-4 border-primary-500 shadow-md mb-3"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-primary-400 font-bold text-2xl mb-3 shadow-inner">
                {p.full_name ? p.full_name.charAt(0).toUpperCase() : 'CV'}
              </div>
            )}
            <h1 className="text-base font-bold text-center text-white tracking-tight leading-snug">
              {p.full_name || 'Nama Lengkap'}
            </h1>
            <p className="text-[11px] text-primary-400 text-center font-medium mt-0.5">
              {p.job_title || 'Profesi'}
            </p>
          </div>

          {/* Kontak Info */}
          <div className="mb-6 space-y-2.5 text-[11px] border-t border-slate-800 pt-4">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary-400 mb-2">
              Kontak
            </h3>
            {p.email && (
              <div className="flex items-start gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="break-all text-[10.5px] leading-tight">{p.email}</span>
              </div>
            )}
            {p.phone && (
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                <span className="break-all">{p.phone}</span>
              </div>
            )}
            {p.city && (
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                <span className="break-words">{p.city}</span>
              </div>
            )}
            {p.linkedin_url && (
              <div className="flex items-start gap-2 text-slate-300">
                <Linkedin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-primary-300 text-[10px] break-all leading-tight">{p.linkedin_url}</span>
              </div>
            )}
            {p.github_url && (
              <div className="flex items-start gap-2 text-slate-300">
                <Github className="w-3.5 h-3.5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-primary-300 text-[10px] break-all leading-tight">{p.github_url}</span>
              </div>
            )}
            {p.portfolio_url && (
              <div className="flex items-start gap-2 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-primary-300 text-[10px] break-all leading-tight">{p.portfolio_url}</span>
              </div>
            )}
          </div>

          {/* Hard Skills */}
          {hardSkills.length > 0 && (
            <div className="mb-5 border-t border-slate-800 pt-4">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary-400 mb-2">
                Hard Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {hardSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-medium break-words max-w-full inline-block"
                  >
                    {s.skill_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {softSkills.length > 0 && (
            <div className="mb-5 border-t border-slate-800 pt-4">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary-400 mb-2">
                Soft Skills
              </h3>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {softSkills.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                    <span>{s.skill_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bahasa */}
          {languages.length > 0 && (
            <div className="mb-5 border-t border-slate-800 pt-4">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary-400 mb-2">
                Bahasa
              </h3>
              <div className="space-y-1.5 text-[11px]">
                {languages.map((l, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span className="font-medium">{l.language_name}</span>
                    <span className="text-[10px] text-slate-400">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sertifikasi di Sidebar */}
          {certifications.length > 0 && (
            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary-400 mb-2">
                Sertifikasi
              </h3>
              <div className="space-y-2 text-[10.5px]">
                {certifications.map((c, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-slate-200 leading-snug">{c.certificate_name}</p>
                    <p className="text-[10px] text-slate-400">{c.issuer} ({c.issue_year})</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Kanan (8 dari 12 Kolom) */}
      <div className="col-span-8 p-7 bg-white">
        {/* Ringkasan Profil */}
        {cv.summary && (
          <div className="mb-5 avoid-break">
            <div className="flex items-center gap-2 border-b-2 border-primary-600 pb-1 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Profil Profesional
              </h2>
            </div>
            <p className="text-slate-600 text-justify leading-relaxed">{cv.summary}</p>
          </div>
        )}

        {/* Pengalaman Kerja */}
        {experiences.length > 0 && (
          <div className="mb-5 avoid-break">
            <div className="flex items-center gap-2 border-b-2 border-primary-600 pb-1 mb-2">
              <Briefcase className="w-3.5 h-3.5 text-primary-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Pengalaman Kerja
              </h2>
            </div>
            <div className="space-y-3.5">
              {experiences.map((exp, idx) => (
                <div key={idx} className="avoid-break relative pl-3 border-l-2 border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[12px]">{exp.position}</span>
                    <span className="text-[10.5px] text-primary-700 font-semibold">
                      {exp.start_date} – {exp.is_current ? 'Sekarang' : exp.end_date}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 mb-1">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pengalaman Magang */}
        {internships.length > 0 && (
          <div className="mb-5 avoid-break">
            <div className="flex items-center gap-2 border-b-2 border-primary-600 pb-1 mb-2">
              <Briefcase className="w-3.5 h-3.5 text-primary-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Pengalaman Magang
              </h2>
            </div>
            <div className="space-y-3">
              {internships.map((intern, idx) => (
                <div key={idx} className="avoid-break relative pl-3 border-l-2 border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{intern.position}</span>
                    <span className="text-[10.5px] text-primary-700 font-semibold">{intern.period}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 mb-0.5">{intern.company}</div>
                  {intern.description && (
                    <p className="text-slate-600 leading-relaxed text-[11px]">{intern.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proyek */}
        {projects.length > 0 && (
          <div className="mb-5 avoid-break">
            <div className="flex items-center gap-2 border-b-2 border-primary-600 pb-1 mb-2">
              <FolderKanban className="w-3.5 h-3.5 text-primary-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Proyek Unggulan
              </h2>
            </div>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="avoid-break bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-slate-900">{proj.project_name}</span>
                    {proj.tech_stack && (
                      <span className="text-[10px] text-primary-700 bg-white px-1.5 py-0.5 rounded border border-primary-200 font-mono">
                        {proj.tech_stack}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-slate-600 leading-relaxed text-[11px]">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Riwayat Pendidikan */}
        {educations.length > 0 && (
          <div className="mb-5 avoid-break">
            <div className="flex items-center gap-2 border-b-2 border-primary-600 pb-1 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-primary-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Pendidikan
              </h2>
            </div>
            <div className="space-y-3">
              {educations.map((edu, idx) => (
                <div key={idx} className="avoid-break">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-[10.5px] text-slate-500">
                      {edu.start_year} – {edu.end_year || 'Sekarang'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>{edu.degree} {edu.major ? `– ${edu.major}` : ''}</span>
                    {edu.gpa && <span className="font-semibold text-slate-800">IPK: {edu.gpa}</span>}
                  </div>
                  {edu.description && (
                    <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organisasi & Prestasi */}
        <div className="grid grid-cols-2 gap-4 avoid-break">
          {organizations.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                <Users className="w-3.5 h-3.5 text-primary-600" />
                <h3 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                  Organisasi
                </h3>
              </div>
              <div className="space-y-2">
                {organizations.map((org, idx) => (
                  <div key={idx} className="text-[11px]">
                    <div className="font-semibold text-slate-800">{org.role}</div>
                    <div className="text-[10px] text-slate-500">{org.organization_name} ({org.period})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                <Award className="w-3.5 h-3.5 text-primary-600" />
                <h3 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                  Prestasi
                </h3>
              </div>
              <div className="space-y-2">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="text-[11px]">
                    <div className="font-semibold text-slate-800">{ach.title}</div>
                    <div className="text-[10px] text-slate-500">{ach.issuer} ({ach.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModern;
