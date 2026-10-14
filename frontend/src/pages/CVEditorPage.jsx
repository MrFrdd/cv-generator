import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Check, 
  Layers, 
  User, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Award, 
  Wrench, 
  Globe2, 
  Trophy, 
  FolderKanban, 
  Maximize2,
  FileCheck2
} from 'lucide-react';
import { cvService } from '../services/cvService';
import { defaultCVData } from '../utils/sampleData';
import CVRenderer from '../components/cv-templates/CVRenderer';
import ScaledA4Preview from '../components/cv-templates/ScaledA4Preview';
import Toast from '../components/common/Toast';

// Form Section Components
import PersonalForm from '../components/cv-form/PersonalForm';
import SummaryForm from '../components/cv-form/SummaryForm';
import EducationForm from '../components/cv-form/EducationForm';
import ExperienceForm from '../components/cv-form/ExperienceForm';
import InternshipForm from '../components/cv-form/InternshipForm';
import OrganizationForm from '../components/cv-form/OrganizationForm';
import SkillsForm from '../components/cv-form/SkillsForm';
import CertificationForm from '../components/cv-form/CertificationForm';
import LanguageForm from '../components/cv-form/LanguageForm';
import AchievementForm from '../components/cv-form/AchievementForm';
import ProjectForm from '../components/cv-form/ProjectForm';

const CVEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isSaved, setIsSaved] = useState(true);

  // Consolidated CV state
  const [cvData, setCvData] = useState({
    cv: { title: 'Curriculum Vitae', template_id: 'modern', summary: '' },
    personal_information: {},
    educations: [],
    work_experiences: [],
    internships: [],
    organizations: [],
    skills: [],
    certifications: [],
    languages: [],
    achievements: [],
    projects: []
  });

  // Fetch CV from backend
  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true);
        const res = await cvService.getCVById(id);
        if (res.success) {
          setCvData({
            cv: res.data.cv || { title: 'Curriculum Vitae', template_id: 'modern', summary: '' },
            personal_information: res.data.personal_information || {},
            educations: res.data.educations || [],
            work_experiences: res.data.work_experiences || [],
            internships: res.data.internships || [],
            organizations: res.data.organizations || [],
            skills: res.data.skills || [],
            certifications: res.data.certifications || [],
            languages: res.data.languages || [],
            achievements: res.data.achievements || [],
            projects: res.data.projects || []
          });
        }
      } catch (err) {
        setToast({ message: 'Gagal memuat data CV. Pastikan Anda memiliki akses.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id]);

  // Handler update field per section
  const handleSectionChange = (sectionKey, updatedSectionData) => {
    setCvData((prev) => ({
      ...prev,
      [sectionKey]: updatedSectionData
    }));
    setIsSaved(false);
  };

  // Simpan data ke backend
  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        title: cvData.cv?.title,
        template_id: cvData.cv?.template_id,
        summary: cvData.cv?.summary,
        personal_information: cvData.personal_information,
        educations: cvData.educations,
        work_experiences: cvData.work_experiences,
        internships: cvData.internships,
        organizations: cvData.organizations,
        skills: cvData.skills,
        certifications: cvData.certifications,
        languages: cvData.languages,
        achievements: cvData.achievements,
        projects: cvData.projects
      };

      const res = await cvService.updateCV(id, payload);
      if (res.success) {
        setIsSaved(true);
        setToast({ message: 'Semua perubahan berhasil disimpan!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: 'Gagal menyimpan perubahan ke server.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Ganti template visual (Data tetap utuh)
  const handleTemplateChange = async (templateId) => {
    setCvData((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        template_id: templateId
      }
    }));
    setIsSaved(false);
    try {
      await cvService.updateTemplate(id, templateId);
    } catch (err) {
      console.warn('Gagal sync template:', err);
    }
  };

  // Isi otomatis contoh data akademik / profesional
  const handleLoadSampleData = () => {
    setCvData((prev) => ({
      ...defaultCVData,
      cv: {
        ...defaultCVData.cv,
        id: prev.cv?.id || id,
        title: prev.cv?.title || 'Curriculum Vitae'
      }
    }));
    setIsSaved(false);
    setToast({ message: 'Data contoh berhasil dimuat!', type: 'info' });
  };

  const navItems = [
    { id: 'personal', label: '1. Data Pribadi', icon: User },
    { id: 'summary', label: '2. Profil Singkat', icon: FileText },
    { id: 'education', label: '3. Pendidikan', icon: GraduationCap },
    { id: 'experience', label: '4. Pengalaman Kerja', icon: Briefcase },
    { id: 'internship', label: '5. Magang', icon: Briefcase },
    { id: 'organization', label: '6. Organisasi', icon: Users },
    { id: 'skills', label: '7. Skills', icon: Wrench },
    { id: 'certifications', label: '8. Sertifikasi', icon: Award },
    { id: 'languages', label: '9. Bahasa', icon: Globe2 },
    { id: 'achievements', label: '10. Prestasi', icon: Trophy },
    { id: 'projects', label: '11. Proyek', icon: FolderKanban },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-slate-600">Memuat Editor CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Action Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-30 px-4 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {cvData.cv?.title || 'CV Tanpa Judul'}
              </h1>
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <span>Template: <strong className="uppercase text-blue-600 font-bold">{cvData.cv?.template_id || 'modern'}</strong></span>
                <span>•</span>
                <span className={isSaved ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                  {isSaved ? "Semua tersimpan" : "Ada perubahan belum tersimpan"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSampleData}
              className="px-2.5 py-1.5 text-xs text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 bg-white rounded-lg font-medium flex items-center gap-1.5 transition"
              title="Muat data contoh untuk pengujian cepat"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Isi Contoh Data</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3.5 py-1.5 brand-btn rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-brand transition disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Menyimpan...' : 'Simpan CV'}</span>
            </button>

            <Link
              to={`/cv/preview/${id}`}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-slate-300" />
              <span>Preview & Cetak A4</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dual-Pane Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Form Editor (7 Kolom) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Template Quick Switch Bar */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Desain Template:
            </span>
            <div className="flex gap-1.5">
              {['modern', 'professional', 'minimalist'].map((tName) => (
                <button
                  key={tName}
                  onClick={() => handleTemplateChange(tName)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-lg capitalize transition ${
                    cvData.cv?.template_id === tName
                      ? 'brand-btn shadow-sm font-bold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tName}
                </button>
              ))}
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 bg-white px-2 py-1.5 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Section Form Content */}
          <div className="p-5 max-h-[calc(100vh-280px)] overflow-y-auto bg-white">
            {activeTab === 'personal' && (
              <PersonalForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'summary' && (
              <SummaryForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'education' && (
              <EducationForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'experience' && (
              <ExperienceForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'internship' && (
              <InternshipForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'organization' && (
              <OrganizationForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'skills' && (
              <SkillsForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'certifications' && (
              <CertificationForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'languages' && (
              <LanguageForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'achievements' && (
              <AchievementForm data={cvData} onChange={handleSectionChange} />
            )}
            {activeTab === 'projects' && (
              <ProjectForm data={cvData} onChange={handleSectionChange} />
            )}
          </div>
        </div>

        {/* Right Pane: Sticky Real-Time Live Preview (5 Kolom) */}
        <div className="lg:col-span-6 hidden lg:block sticky top-28">
          <div className="bg-slate-900 text-slate-100 px-4 py-2.5 rounded-t-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-white">Live Preview Interaktif (A4)</span>
            </div>
            <Link
              to={`/cv/preview/${id}`}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition"
            >
              <span>Layar Penuh</span>
              <Maximize2 className="w-3 h-3 text-blue-400" />
            </Link>
          </div>

          {/* Preview: CV otomatis menyesuaikan lebar panel, tampil utuh & bisa di-scroll */}
          <div
            className="bg-slate-200/90 p-4 rounded-b-2xl border-x border-b border-slate-300 shadow-inner max-h-[calc(100vh-170px)] overflow-y-auto"
            style={{ scrollbarGutter: 'stable' }}
          >
            <ScaledA4Preview>
              <CVRenderer
                templateId={cvData.cv?.template_id || 'modern'}
                data={cvData}
              />
            </ScaledA4Preview>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default CVEditorPage;