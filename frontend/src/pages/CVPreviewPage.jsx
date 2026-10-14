import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Smartphone, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { cvService } from '../services/cvService';
import CVRenderer from '../components/cv-templates/CVRenderer';
import { printCV, downloadPDF } from '../utils/printA4';
import Toast from '../components/common/Toast';

// Lebar A4 (210mm) dalam piksel standar 96 DPI
const A4_WIDTH_PX = 794;

const CVPreviewPage = () => {
  const { id } = useParams();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Refs untuk kalkulasi responsive scaling
  const containerRef = useRef(null);
  const sheetRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(0);

  // Zoom control state: 'fit' | '100%' | 'custom'
  const [zoomMode, setZoomMode] = useState('fit');
  const [customScale, setCustomScale] = useState(1);

  // Fetch CV data
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

  // Kalkulasi otomatis skala lembar A4 agar muat sempurna di layar HP / Desktop
  useEffect(() => {
    const container = containerRef.current;
    const sheet = sheetRef.current;
    if (!container || !sheet) return undefined;

    const updateScale = () => {
      // Sisakan padding aman 24px di HP
      const availableWidth = container.clientWidth - 24;
      if (availableWidth > 0) {
        // Jika layar lebih kecil dari A4 (seperti layar HP), otomatis perkecil
        const calculatedScale = Math.min(1, Math.max(0.25, availableWidth / A4_WIDTH_PX));
        setFitScale(calculatedScale);
      }
      setSheetHeight(sheet.offsetHeight);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);
    resizeObserver.observe(sheet);

    return () => resizeObserver.disconnect();
  }, [cvData, loading]);

  // Tentukan skala efektif yang digunakan saat ini
  const effectiveScale = zoomMode === 'fit' ? fitScale : (zoomMode === '100%' ? 1 : customScale);

  const handleZoomIn = () => {
    setZoomMode('custom');
    setCustomScale((prev) => Math.min(1.5, Math.round((effectiveScale + 0.1) * 10) / 10));
  };

  const handleZoomOut = () => {
    setZoomMode('custom');
    setCustomScale((prev) => Math.max(0.3, Math.round((effectiveScale - 0.1) * 10) / 10));
  };

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
    <div className="min-h-screen bg-slate-200/95 flex flex-col">
      {/* Top Floating Control Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-sm no-print">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Baris 1: Tombol Navigasi & Nama CV */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5">
            <Link
              to={`/cv/edit/${id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Editor</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            <div className="truncate max-w-[180px] sm:max-w-xs">
              <span className="text-xs font-bold text-slate-900 truncate block">{cvData?.cv?.title}</span>
              <span className="text-[10px] text-slate-500 truncate block">
                {cvData?.personal_information?.full_name || 'Tanpa Nama'}
              </span>
            </div>

            {/* Template Switcher Mobile & Desktop */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 ml-auto sm:ml-0">
              {['modern', 'professional', 'minimalist'].map((tName) => (
                <button
                  key={tName}
                  onClick={() => handleTemplateSwitch(tName)}
                  className={`px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-md capitalize transition ${
                    activeTemplate === tName
                      ? 'bg-white text-blue-700 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tName}
                </button>
              ))}
            </div>
          </div>

          {/* Baris 2: Tombol Aksi Download & Cetak */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition"
              title="Cetak langsung menggunakan Browser Print Engine A4"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white brand-btn rounded-xl shadow-brand transition disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Membuat PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Zoom & Fit Bar Khusus HP / Tampilan Kecil */}
      <div className="bg-slate-100/90 backdrop-blur-md border-b border-slate-200 px-3 py-1.5 sticky top-[57px] sm:top-[49px] z-30 no-print flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 hidden sm:inline">Tampilan Layar:</span>

          <button
            onClick={() => setZoomMode('fit')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              zoomMode === 'fit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
            title="Sesuaikan otomatis agar seluruh lebar CV terlihat penuh di layar HP"
          >
            <Smartphone className="w-3 h-3" />
            <span>Fit Layar HP</span>
          </button>

          <button
            onClick={() => setZoomMode('100%')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              zoomMode === '100%'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
            title="Lihat ukuran asli A4 100% (bisa digeser horizontal)"
          >
            <Maximize2 className="w-3 h-3" />
            <span>100% Asli</span>
          </button>

          <div className="h-3.5 w-px bg-slate-300 mx-1"></div>

          {/* Tombol Zoom In & Out */}
          <button
            onClick={handleZoomOut}
            className="p-1 rounded bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition"
            title="Perkecil tampilan"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-bold text-slate-700 px-1 min-w-[38px] text-center">
            {Math.round(effectiveScale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-1 rounded bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition"
            title="Perbesar tampilan"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {effectiveScale < 1 && (
          <span className="text-[10px] text-blue-600 font-medium hidden md:inline">
            ✨ CV diskalakan agar muat penuh tanpa terpotong
          </span>
        )}
      </div>

      {/* Main Canvas Area */}
      <main
        ref={containerRef}
        className="flex-1 p-2 sm:p-8 flex justify-center items-start overflow-auto w-full"
      >
        {/* Scaled Responsive Wrapper */}
        <div
          className="mx-auto transition-all duration-150 shadow-2xl rounded-sm print:shadow-none bg-white overflow-hidden print:w-auto print:h-auto"
          style={{
            width: A4_WIDTH_PX * effectiveScale,
            height: sheetHeight ? sheetHeight * effectiveScale : 'auto',
          }}
        >
          {/* Printable Element (#cv-print-area) */}
          <div
            id="cv-print-area"
            ref={sheetRef}
            className="bg-white print:m-0 print:p-0"
            style={{
              width: A4_WIDTH_PX,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
            }}
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
