import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Printer, 
  Download, 
  Layers, 
  Check, 
  FileText 
} from 'lucide-react';
import { cvService } from '../services/cvService';
import CVRenderer from '../components/cv-templates/CVRenderer';
import { printCV, downloadPDF } from '../utils/printA4';
import Toast from '../components/common/Toast';

const CVPreviewPage = () => {
  const { id } = useParams();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true);
        const res = await cvService.getCVById(id);
        if (res.success) {
          setCvData(res.data);
        }
      } catch (err) {
        setToast({ message: 'Gagal memuat dokumen CV.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id]);

  const handleTemplateSwitch = async (newTemplateId) => {
    setCvData((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        template_id: newTemplateId
      }
    }));
    try {
      await cvService.updateTemplate(id, newTemplateId);
      setToast({ message: `Template berhasil diubah ke ${newTemplateId}!`, type: 'info' });
    } catch (err) {
      console.warn('Gagal sync template:', err);
    }
  };

  const handlePrint = () => {
    printCV();
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const filename = `${cvData?.personal_information?.full_name || 'CV'}_${cvData?.cv?.title || 'Dokumen'}.pdf`
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      
      const success = await downloadPDF('cv-print-area', filename);
      if (success) {
        setToast({ message: 'Dokumen PDF berhasil diunduh!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: 'Gagal mengunduh PDF. Mengalihkan ke dialog cetak browser...', type: 'info' });
      printCV();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-slate-600">Menyiapkan Pratinjau Dokumen A4...</p>
        </div>
      </div>
    );
  }

  const activeTemplate = cvData?.cv?.template_id || 'modern';

  return (
    <div className="min-h-screen bg-slate-200/90 flex flex-col">
      {/* Top Floating Control Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-sm no-print">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to={`/cv/edit/${id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Editor</span>
            </Link>
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-900">{cvData?.cv?.title}</span>
              <span className="text-[11px] text-slate-500 ml-2">({cvData?.personal_information?.full_name || 'Tanpa Nama'})</span>
            </div>
          </div>

          {/* Template Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 hidden md:inline">
              Template:
            </span>
            {['modern', 'professional', 'minimalist'].map((tName) => (
              <button
                key={tName}
                onClick={() => handleTemplateSwitch(tName)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                  activeTemplate === tName
                    ? 'bg-white text-blue-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tName}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/cv/edit/${id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Edit Data</span>
            </Link>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition"
              title="Cetak langsung menggunakan Browser Print Engine A4"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak A4</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white brand-btn rounded-xl shadow-brand transition disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Membuat PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 p-4 sm:p-8 flex justify-center items-start overflow-auto">
        {/* Printable/Exportable Container */}
        <div className="shadow-2xl rounded-sm print:shadow-none">
          <div
            id="cv-print-area"
            className="bg-white print:m-0 print:p-0"
          >
            <CVRenderer templateId={activeTemplate} data={cvData} />
          </div>
        </div>
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default CVPreviewPage;
