import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Briefcase, GraduationCap, Code, BookOpen, Users } from 'lucide-react';

const TemplateProfessional = ({ data }) => {
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
    <div className="a4-sheet p-8 font-sans text-slate-800 leading-relaxed text-xs">
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-5 mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            {p.full_name || 'Nama Lengkap'}
          </h1>
          <p className="text-sm font-semibold text-primary-700 tracking-wide mt-1">
            {p.job_title || 'Profesi / Posisi yang Dilamar'}
          </p>
        </div>
        {p.photo_url && (
          <img
            src={p.photo_url.startsWith('http') ? p.photo_url : `http://localhost:5000${p.photo_url}`}
            alt={p.full_name}
            className="w-20 h-24 object-cover rounded border border-slate-300 shadow-sm"
          />
        )}
      </div>

      {/* Contact Bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-slate-600 border-b border-slate-200 pb-3 mb-5">
        {p.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
            <span className="break-all">{p.email}</span>
          </div>
        )}
        {p.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
            <span className="break-all">{p.phone}</span>
          </div>
        )}
        {p.city && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
            <span className="break-words">{p.city}{p.address ? `, ${p.address}` : ''}</span>
          </div>
        )}
        {p.linkedin_url && (
          <div className="flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
            <span className="text-[10px] break-all">{p.linkedin_url}</span>
          </div>
        )}
        {p.github_url && (
          <div className="flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
            <span className="text-[10px] break-all">{p.github_url}</span>
          </div>
        )}
        {p.portfolio_url && (
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
            <span className="text-[10px] break-all">{p.portfolio_url}</span>
          </div>
        )}
      </div>

      {/* Ringkasan Profil */}
      {cv.summary && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Ringkasan Profesional
          </h2>
          <p className="text-slate-700 text-justify leading-normal">{cv.summary}</p>
        </div>
      )}

      {/* Pengalaman Kerja */}
      {experiences.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Pengalaman Kerja
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={idx} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[12px]">{exp.position}</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {exp.start_date} – {exp.is_current ? 'Sekarang' : exp.end_date}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium mb-1">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pengalaman Magang */}
      {internships.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Pengalaman Magang
          </h2>
          <div className="space-y-2.5">
            {internships.map((intern, idx) => (
              <div key={idx} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{intern.position}</span>
                  <span className="text-[11px] text-slate-500">{intern.period}</span>
                </div>
                <div className="text-slate-600 font-medium mb-0.5">{intern.company}</div>
                {intern.description && <p className="text-slate-600 leading-relaxed">{intern.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pendidikan */}
      {educations.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Riwayat Pendidikan
          </h2>
          <div className="space-y-2.5">
            {educations.map((edu, idx) => (
              <div key={idx} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{edu.institution}</span>
                  <span className="text-[11px] text-slate-500">
                    {edu.start_year} – {edu.end_year || 'Sekarang'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>
                    {edu.degree} {edu.major ? `– ${edu.major}` : ''}
                  </span>
                  {edu.gpa && <span className="font-medium text-slate-700">IPK: {edu.gpa}</span>}
                </div>
                {edu.description && <p className="text-slate-600 mt-0.5 leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proyek */}
      {projects.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Proyek & Portofolio
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={idx} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{proj.project_name}</span>
                  {proj.tech_stack && (
                    <span className="text-[10px] text-primary-800 bg-primary-50 px-1.5 py-0.5 rounded font-mono">
                      {proj.tech_stack}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 mt-0.5 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills (Hard & Soft) */}
      {(hardSkills.length > 0 || softSkills.length > 0) && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Keterampilan & Kompetensi
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {hardSkills.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800 text-[11px] block mb-1">Hard Skills:</span>
                <p className="text-slate-600 leading-normal">
                  {hardSkills.map(s => s.skill_name).join(' • ')}
                </p>
              </div>
            )}
            {softSkills.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800 text-[11px] block mb-1">Soft Skills:</span>
                <p className="text-slate-600 leading-normal">
                  {softSkills.map(s => s.skill_name).join(' • ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid: Organisasi, Sertifikasi, Bahasa, Prestasi */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 avoid-break">
        {organizations.length > 0 && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Organisasi
            </h3>
            <div className="space-y-1.5">
              {organizations.map((org, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-slate-800">{org.role}</div>
                  <div className="text-[11px] text-slate-500">{org.organization_name} ({org.period})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Sertifikasi
            </h3>
            <div className="space-y-1.5">
              {certifications.map((cert, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-slate-800">{cert.certificate_name}</div>
                  <div className="text-[11px] text-slate-500">{cert.issuer} {cert.issue_year ? `• ${cert.issue_year}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Kemampuan Bahasa
            </h3>
            <div className="space-y-1">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{lang.language_name}</span>
                  <span className="text-slate-500 text-[11px]">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Penghargaan & Prestasi
            </h3>
            <div className="space-y-1.5">
              {achievements.map((ach, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-slate-800">{ach.title}</div>
                  <div className="text-[11px] text-slate-500">{ach.issuer} {ach.year ? `(${ach.year})` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateProfessional;
