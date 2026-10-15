import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Layers,
  ArrowRight,
  Zap,
  Printer,
  Eye,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CVRenderer from '../components/cv-templates/CVRenderer';
import ScaledA4Preview from '../components/cv-templates/ScaledA4Preview';
import { defaultCVData } from '../utils/sampleData';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTemplate, setActiveTemplate] = useState('modern');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-20 sm:py-28">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none"></div>

        {/* Soft background ambient gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.08) 0%, rgba(99,102,241,0.04) 50%, transparent 70%)' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Professional Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold mb-6 shadow-sm">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Standar Dokumen Lamaran Kerja & Rasio Cetak A4</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Rancang CV <span className="brand-text">Profesional</span>
              <br />
              Cepat, Rapi, & Terstruktur
            </h1>

            <p className="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Platform terpadu untuk menyusun riwayat hidup siap kerja. Cukup isi data diri satu kali,
              ganti desain template kapan saja tanpa input ulang, dan unduh dokumen siap cetak.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 brand-btn shadow-brand"
              >
                <Zap className="w-4 h-4" />
                <span>Mulai Buat CV</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#templates-showcase"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm border border-slate-300 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-400 hover:bg-slate-50 flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Lihat Contoh Template</span>
              </a>
            </div>

            {/* Stats Strip */}
            <div className="mt-14 flex justify-center gap-8 sm:gap-14 border-t border-slate-100 pt-8 max-w-lg mx-auto">
              {[
                { value: '3', label: 'Pilihan Desain Template' },
                { value: '11', label: 'Section Formulir Lengkap' },
                { value: 'A4', label: 'Presisi Format Cetak' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Keunggulan Sistem</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Mengapa Menggunakan QuickVitae?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Hemat Waktu & Otomatis',
                desc: 'Tidak perlu mendesain format secara manual dari nol. Sistem mengatur tata letak, margin, dan tipografi dokumen secara terstruktur.',
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: 'Data Bersifat Reusable',
                desc: 'Ganti pilihan template dari Modern ke Professional atau Minimalist dengan satu klik tanpa perlu mengetik ulang riwayat hidup Anda.',
              },
              {
                icon: <Printer className="w-6 h-6" />,
                title: 'Format Presisi A4 & Bebas Potong',
                desc: 'Dioptimasi khusus untuk kertas standar A4 (210mm x 297mm) dengan aturan CSS print-safe sehingga teks tidak terpotong di tengah halaman.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-light card-light-hover p-6 rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja (3 Langkah) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Alur Penggunaan</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Hanya 3 Langkah Menuju CV Impian
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Isi Data Riwayat Hidup',
                desc: 'Masukkan data pribadi, profil ringkas, pendidikan, pengalaman kerja, magang, keahlian, hingga portofolio pada formulir yang rapi.',
              },
              {
                step: '02',
                title: 'Pilih Template Desain',
                desc: 'Tersedia pilihan template Professional, Modern, dan Minimalist. Anda dapat melihat perubahan tampilan seketika di Live Preview.',
              },
              {
                step: '03',
                title: 'Unduh Dokumen PDF / Cetak A4',
                desc: 'Simpan dokumen di akun Anda dan langsung unduh sebagai berkas PDF beresolusi tinggi yang siap dikirimkan kepada perekrut.',
              },
            ].map((item) => (
              <div key={item.step} className="card-light card-light-hover p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-black text-blue-600">{item.step}</span>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Template Showcase */}
      <section id="templates-showcase" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Katalog Desain</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Pratinjau Langsung 3 Desain Template
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Klik tombol di bawah untuk melihat bagaimana satu data yang sama ditampilkan pada setiap template:
            </p>

            {/* Template Selector Tabs */}
            <div className="flex justify-center gap-2 mt-8">
              {['modern', 'professional', 'minimalist'].map((tpl) => (
                <button
                  key={tpl}
                  onClick={() => setActiveTemplate(tpl)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 capitalize ${
                    activeTemplate === tpl
                      ? 'brand-btn shadow-brand font-bold'
                      : 'bg-white text-slate-600 border border-slate-300 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tpl === 'modern' ? 'Modern (Tech)' : tpl === 'professional' ? 'Professional' : 'Minimalist (ATS)'}
                </button>
              ))}
            </div>
          </div>

          {/* Scaled Preview Box */}
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200/90 shadow-sm p-3 sm:p-8 flex flex-col items-center bg-slate-100/80">
            <div className="w-full flex justify-center">
              <ScaledA4Preview maxScale={0.85}>
                <CVRenderer templateId={activeTemplate} data={defaultCVData} />
              </ScaledA4Preview>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Format Standar Internasional A4 (210 × 297 mm) — Tampil Utuh & Proporsional di Semua Perangkat</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Siap Membuat CV Terbaik Anda Bersama <span className="brand-text">QuickVitae</span>?
          </h2>
          <p className="mt-4 text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Daftar akun sekarang dan kelola berkas lamaran kerja Anda dengan cepat, rapi, dan berstandar internasional.
          </p>
          <div className="mt-8">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-xl text-sm brand-btn shadow-brand"
            >
              <Zap className="w-4 h-4" />
              <span>Buat CV Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
