import React from 'react';
import { FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg brand-btn flex items-center justify-center text-white">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-800">
            Quick<span className="brand-text">Vitae</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Platform Pembuatan Dokumen Riwayat Hidup & Lamaran Kerja © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
