import React from 'react';

const TemplateMinimalist = ({ data }) => {
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
    <div className="a4-sheet p-10 font-sans text-slate-800 leading-normal text-xs">
      {/* Header */}
      <div className="text-center pb-4 mb-4 border-b border-slate-300">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          {p.full_name || 'Nama Lengkap'}
        </h1>
        <p className="text-xs font-medium text-slate-600 tracking-wide mt-1 uppercase">
          {p.job_title || 'Profesi / Posisi'}
        </p>

        {/* Kontak Baris Tunggal */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-2">
          {p.city && <span>{p.city}{p.address ? `, ${p.address}` : ''}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.email && <span>• <span className="break-all">{p.email}</span></span>}
          {p.linkedin_url && (
            <span>
              • <span className="text-[10px] break-all">{p.linkedin_url}</span>
            </span>
          )}
          {p.github_url && (
            <span>
              • <span className="text-[10px] break-all">{p.github_url}</span>
            </span>
          )}
          {p.portfolio_url && (
            <span>
              • <span className="text-[10px] break-all">{p.portfolio_url}</span>
            </span>
          )}
        </div>
      </div>

      {/* Ringkasan Profil */}
      {cv.summary && (
        <div className="mb-4 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Ringkasan Profesional
          </h2>
          <p className="text-slate-700 text-justify leading-relaxed">{cv.summary}</p>
        </div>
      )}

      {/* Pengalaman Kerja */}
      {experiences.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Pengalaman Kerja
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={idx} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[12px]">{exp.position}</span>
                  <span className="text-[11px] text-slate-600">
                    {exp.start_date} – {exp.is_current ? 'Sekarang' : exp.end_date}
                  </span>
                </div>
                <div className="italic text-slate-700 text-[11px] mb-1">
                  {exp.company} {exp.location ? `— ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed pl-2 border-l border-slate-300">
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
        <div className="mb-4 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Pengalaman Magang
          </h2>
          <div className="space-y-2.5">
            {internships.map((intern, idx) => (
              <div key={idx} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{intern.position}</span>
                  <span className="text-[11px] text-slate-600">{intern.period}</span>
                </div>
                <div className="italic text-slate-700 text-[11px]">{intern.company}</div>
                {intern.description && <p className="text-slate-600 mt-0.5 leading-relaxed pl-2 border-l border-slate-300">{intern.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pendidikan */}
      {educations.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Pendidikan
          </h2>
          <div className="space-y-2.5">
            {educations.map((edu, idx) => (
              <div key={idx} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{edu.institution}</span>
                  <span className="text-[11px] text-slate-600">
                    {edu.start_year} – {edu.end_year || 'Sekarang'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700 text-[11px]">
                  <span>{edu.degree} {edu.major ? `dalam ${edu.major}` : ''}</span>
                  {edu.gpa && <span className="font-medium">IPK: {edu.gpa}</span>}
                </div>
                {edu.description && <p className="text-slate-600 mt-0.5 leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proyek */}
      {projects.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Proyek & Karya
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={idx} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{proj.project_name}</span>
                  {proj.tech_stack && (
                    <span className="text-[10px] text-slate-600 italic">
                      ({proj.tech_stack})
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keterampilan & Bahasa */}
      <div className="mb-4 avoid-break">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
          Keterampilan & Bahasa
        </h2>
        <div className="space-y-1 text-slate-700 leading-relaxed text-[11px]">
          {hardSkills.length > 0 && (
            <div>
              <span className="font-bold text-slate-900">Keterampilan Teknis (Hard Skills): </span>
              {hardSkills.map(s => s.skill_name).join(', ')}
            </div>
          )}
          {softSkills.length > 0 && (
            <div>
              <span className="font-bold text-slate-900">Keterampilan Interpersonal (Soft Skills): </span>
              {softSkills.map(s => s.skill_name).join(', ')}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <span className="font-bold text-slate-900">Bahasa: </span>
              {languages.map(l => `${l.language_name} (${l.proficiency})`).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Organisasi, Sertifikasi & Prestasi */}
      <div className="grid grid-cols-3 gap-3 avoid-break text-[11px]">
        {organizations.length > 0 && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
              Organisasi
            </h3>
            {organizations.map((org, idx) => (
              <div key={idx} className="mb-1">
                <div className="font-semibold text-slate-800">{org.role}</div>
                <div className="text-[10px] text-slate-600">{org.organization_name}</div>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
              Sertifikasi
            </h3>
            {certifications.map((cert, idx) => (
              <div key={idx} className="mb-1">
                <div className="font-semibold text-slate-800">{cert.certificate_name}</div>
                <div className="text-[10px] text-slate-600">{cert.issuer} ({cert.issue_year})</div>
              </div>
            ))}
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
              Prestasi
            </h3>
            {achievements.map((ach, idx) => (
              <div key={idx} className="mb-1">
                <div className="font-semibold text-slate-800">{ach.title}</div>
                <div className="text-[10px] text-slate-600">{ach.issuer} ({ach.year})</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateMinimalist;
