export const defaultCVData = {
  cv: {
    title: 'Curriculum Vitae',
    template_id: 'modern',
    summary: 'Fresh graduate Informatika dengan keahlian pengembangan aplikasi web full-stack, pemodelan basis data relasional, dan integrasi REST API. Memiliki ketelitian tinggi dalam menganalisis kebutuhan sistem serta adaptif bekerja secara mandiri maupun dalam tim kolaboratif.'
  },
  personal_information: {
    full_name: 'Budi Santoso, S.Kom.',
    job_title: 'Junior Web Developer',
    photo_url: '',
    email: 'budi.santoso@email.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Merdeka No. 45',
    city: 'Jakarta Selatan',
    linkedin_url: 'https://linkedin.com/in/budisantoso',
    github_url: 'https://github.com/budisantoso',
    portfolio_url: 'https://budisantoso.dev'
  },
  educations: [
    {
      institution: 'Universitas Indonesia',
      degree: 'Sarjana (S1)',
      major: 'Teknik Informatika',
      start_year: '2020',
      end_year: '2024',
      gpa: '3.82 / 4.00',
      description: 'Fokus skripsi pada implementasi sistem otomatisasi dokumen berbasis web. Aktif di Asosiasi Mahasiswa Informatika.'
    }
  ],
  work_experiences: [
    {
      company: 'PT Solusi Teknologi Nusantara',
      position: 'Junior Web Developer',
      location: 'Jakarta',
      start_date: 'Sep 2024',
      end_date: 'Sekarang',
      is_current: 1,
      description: 'Mengembangkan modul antarmuka pengguna berbasis React dan Tailwind CSS. Mengoptimalkan performa rendering halaman hingga 30% dan mengintegrasikan 15+ endpoint REST API.'
    }
  ],
  internships: [
    {
      company: 'PT Inovasi Digital Mandiri',
      position: 'Web Developer Intern',
      period: 'Feb 2024 - Agu 2024 (6 Bulan)',
      description: 'Membangun fitur dashboard analitik pengguna dan membantu perancangan skema database MySQL.'
    }
  ],
  organizations: [
    {
      organization_name: 'Himpunan Mahasiswa Informatika',
      role: 'Ketua Divisi Pengembangan Teknologi',
      period: '2022 - 2023',
      description: 'Memimpin tim beranggotakan 8 staf dalam mengembangkan website portal informasi mahasiswa dan menyelenggarakan workshop pemrograman web.'
    }
  ],
  skills: [
    { skill_name: 'JavaScript / React.js', category: 'hard', level: 'Advanced' },
    { skill_name: 'Node.js & Express', category: 'hard', level: 'Intermediate' },
    { skill_name: 'MySQL / Database Design', category: 'hard', level: 'Advanced' },
    { skill_name: 'Tailwind CSS & Responsive UI', category: 'hard', level: 'Expert' },
    { skill_name: 'Git & GitHub Collaboration', category: 'hard', level: 'Advanced' },
    { skill_name: 'Problem Solving & Analisis Kebutuhan', category: 'soft', level: 'Advanced' },
    { skill_name: 'Komunikasi & Kerja Tim', category: 'soft', level: 'Expert' },
    { skill_name: 'Manajemen Waktu', category: 'soft', level: 'Advanced' }
  ],
  certifications: [
    {
      certificate_name: 'Certified Full-Stack Web Developer',
      issuer: 'Dicoding Indonesia & Kemendikbud',
      issue_year: '2024',
      credential_url: 'https://dicoding.com/certificates/123456'
    }
  ],
  languages: [
    { language_name: 'Bahasa Indonesia', proficiency: 'Penutur Asli (Native)' },
    { language_name: 'Bahasa Inggris', proficiency: 'Profesional (TOEFL 560)' }
  ],
  achievements: [
    {
      title: 'Juara 2 Lomba Inovasi Aplikasi Web Mahasiswa',
      issuer: 'Kementerian Komunikasi dan Informatika',
      year: '2023',
      description: 'Mengembangkan prototipe aplikasi sistem manajemen perpustakaan terdistribusi.'
    }
  ],
  projects: [
    {
      project_name: 'Sistem Generator CV Otomatis Berbasis Web',
      tech_stack: 'React, Express.js, MySQL, Tailwind CSS',
      github_link: 'https://github.com/budisantoso/cv-generator',
      demo_link: 'https://cv-generator-demo.web.app',
      description: 'Aplikasi web untuk membuat dokumen CV profesional dengan live preview dan ekspor dokumen PDF ukuran A4 presisi.'
    }
  ]
};
