import html2pdf from 'html2pdf.js';

/**
 * Memicu dialog cetak native browser yang telah dioptimasi dengan @media print A4
 */
export const printCV = () => {
  window.print();
};

/**
 * Mengunduh elemen dokumen CV sebagai berkas PDF berstandar A4 menggunakan html2pdf.js
 * @param {string} elementId ID elemen yang membungkus lembar CV
 * @param {string} filename Nama file output
 */
export const downloadPDF = async (elementId, filename = 'Curriculum_Vitae.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemen dengan ID "${elementId}" tidak ditemukan.`);
    return false;
  }

  // Simpan transform asli (jika sedang di-scale untuk tampilan mobile responsive)
  const prevTransform = element.style.transform;
  const prevTransformOrigin = element.style.transformOrigin;
  element.style.transform = 'none';
  element.style.transformOrigin = 'initial';

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Gagal men-generate PDF:', error);
    // Fallback otomatis ke native print jika html2pdf terkendala
    window.print();
    return false;
  } finally {
    // Kembalikan scale responsive
    element.style.transform = prevTransform;
    element.style.transformOrigin = prevTransformOrigin;
  }
};
