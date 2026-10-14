/**
 * Script Pengujian Fungsional Otomatis (Black-box & Integration Testing)
 * Menguji seluruh alur Waterfall: Auth -> CV Creation -> 11 Sections -> Template Switch -> Auth Isolation -> Delete
 */

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=====================================================');
  console.log('🧪 MEMULAI PENGUJIAN INTEGRASI METODE WATERFALL');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  const testUser = {
    name: 'Ahmad Dahlan',
    email: `ahmad_${Date.now()}@testmail.com`,
    password: 'password123'
  };

  let token = null;
  let createdCvId = null;

  try {
    // 1. Uji Register
    console.log('[1/10] Pengujian Modul Registrasi Akun...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    }).then(r => r.json());
    assert(regRes.success === true && regRes.data?.token, 'Registrasi akun baru berhasil');

    // 2. Uji Registrasi Email Duplikat (Validasi)
    console.log('\n[2/10] Pengujian Validasi Email Duplikat...');
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    assert(dupRes.status === 409, 'Pencegahan registrasi email duplikat berhasil (Status 409)');

    // 3. Uji Login
    console.log('\n[3/10] Pengujian Login & Penerbitan JWT Token...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    }).then(r => r.json());
    assert(loginRes.success === true && loginRes.data?.token, 'Login berhasil dan token JWT diterima');
    token = loginRes.data.token;

    // 4. Uji Ambil Templates
    console.log('\n[4/10] Pengujian Pengambilan Daftar Template CV...');
    const tplRes = await fetch(`${BASE_URL}/templates`).then(r => r.json());
    assert(tplRes.success === true && tplRes.data.length >= 3, `Templates tersedia: ${tplRes.data.map(t => t.id).join(', ')}`);

    // 5. Uji Buat CV Baru
    console.log('\n[5/10] Pengujian Inisialisasi CV Baru...');
    const cvCreateRes = await fetch(`${BASE_URL}/cvs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'CV Software Engineer 2026',
        template_id: 'modern'
      })
    }).then(r => r.json());
    assert(cvCreateRes.success === true && cvCreateRes.data?.id, `CV baru berhasil dibuat dengan ID: ${cvCreateRes.data?.id}`);
    createdCvId = cvCreateRes.data.id;

    // 6. Uji Update Seluruh 11 Section CV (Atomik Transaksi)
    console.log('\n[6/10] Pengujian Simpan/Update 11 Section CV Sekaligus...');
    const updatePayload = {
      title: 'CV Full Stack Developer 2026',
      template_id: 'modern',
      summary: 'Software engineer berpengalaman dalam ekosistem React, Node.js, dan MySQL.',
      personal_information: {
        full_name: 'Ahmad Dahlan, S.Kom.',
        job_title: 'Full Stack Web Developer',
        email: testUser.email,
        phone: '+62 812-9999-8888',
        city: 'Bandung',
        address: 'Jl. Dago Atas No. 12',
        linkedin_url: 'https://linkedin.com/in/ahmaddahlan',
        github_url: 'https://github.com/ahmaddahlan',
        portfolio_url: 'https://ahmad.dev'
      },
      educations: [
        {
          institution: 'Institut Teknologi Bandung',
          degree: 'Sarjana (S1)',
          major: 'Teknik Informatika',
          start_year: '2020',
          end_year: '2024',
          gpa: '3.90',
          description: 'Lulus dengan predikat Cum Laude'
        }
      ],
      work_experiences: [
        {
          company: 'PT Global Solusindo',
          position: 'Software Engineer',
          location: 'Jakarta (Remote)',
          start_date: 'Jan 2024',
          end_date: 'Sekarang',
          is_current: 1,
          description: 'Mengembangkan sistem otomasi dokumen skala besar.'
        }
      ],
      internships: [
        {
          company: 'Startup Digital Indonesia',
          position: 'Full Stack Intern',
          period: 'Jun 2023 - Des 2023',
          description: 'Mengoptimasi query MySQL'
        }
      ],
      organizations: [
        {
          organization_name: 'Google Developer Student Clubs ITB',
          role: 'Core Team Web Development',
          period: '2022 - 2023',
          description: 'Menyelenggarakan workshop React & Tailwind'
        }
      ],
      skills: [
        { skill_name: 'React.js', category: 'hard', level: 'Expert' },
        { skill_name: 'Node.js & Express', category: 'hard', level: 'Advanced' },
        { skill_name: 'MySQL 3NF Design', category: 'hard', level: 'Advanced' },
        { skill_name: 'Komunikasi & Kolaborasi Tim', category: 'soft', level: 'Expert' }
      ],
      certifications: [
        {
          certificate_name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          issue_year: '2024',
          credential_url: 'https://aws.amazon.com/verify'
        }
      ],
      languages: [
        { language_name: 'Bahasa Indonesia', proficiency: 'Native' },
        { language_name: 'Bahasa Inggris', proficiency: 'Profesional (IELTS 7.5)' }
      ],
      achievements: [
        {
          title: 'Juara 1 Hackathon Nasional 2023',
          issuer: 'Kemenparekraf',
          year: '2023',
          description: 'Aplikasi inovasi otomasi administrasi'
        }
      ],
      projects: [
        {
          project_name: 'CV Generator Automation',
          tech_stack: 'React, Express, MySQL',
          github_link: 'https://github.com/ahmaddahlan/cv-generator',
          demo_link: 'https://cv-gen.web.app',
          description: 'Sistem pembuatan CV otomatis berstandar A4'
        }
      ]
    };

    const updateRes = await fetch(`${BASE_URL}/cvs/${createdCvId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatePayload)
    }).then(r => r.json());
    assert(updateRes.success === true, 'Update transaksi atomik 11 section CV berhasil');

    // 7. Uji Ambil Detail CV & Integritas Relasi
    console.log('\n[7/10] Pengujian Integritas Relasi 3NF (Data Child)...');
    const getDetailRes = await fetch(`${BASE_URL}/cvs/${createdCvId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    assert(getDetailRes.success === true, 'Detail CV berhasil diambil');
    assert(getDetailRes.data.educations.length === 1, 'Data educations terverifikasi tersimpan');
    assert(getDetailRes.data.work_experiences.length === 1, 'Data work_experiences terverifikasi tersimpan');
    assert(getDetailRes.data.skills.length === 4, 'Data skills terverifikasi tersimpan');
    assert(getDetailRes.data.projects.length === 1, 'Data projects terverifikasi tersimpan');

    // 8. Uji Ganti Template (Data Reusability)
    console.log('\n[8/10] Pengujian Penggantian Template Visual (Data Preserved)...');
    const switchTplRes = await fetch(`${BASE_URL}/cvs/${createdCvId}/template`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ template_id: 'professional' })
    }).then(r => r.json());
    assert(switchTplRes.success === true, 'Pergantian template ke "professional" berhasil');

    const verifyTplRes = await fetch(`${BASE_URL}/cvs/${createdCvId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    assert(verifyTplRes.data.cv.template_id === 'professional', 'Template_id terbarui di database');
    assert(verifyTplRes.data.personal_information.full_name === 'Ahmad Dahlan, S.Kom.', 'Data personal tetap utuh (Data Reusability)');

    // 9. Uji Keamanan: Akses Tanpa Token / User Lain
    console.log('\n[9/10] Pengujian Keamanan & Isolasi Data Pengguna...');
    const unauthorizedRes = await fetch(`${BASE_URL}/cvs/${createdCvId}`);
    assert(unauthorizedRes.status === 401, 'Akses tanpa token ditolak (Status 401 Unauthorized)');

    // 10. Uji Penghapusan CV (Cascade Delete)
    console.log('\n[10/10] Pengujian Penghapusan CV & Cascade Delete...');
    const deleteRes = await fetch(`${BASE_URL}/cvs/${createdCvId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    assert(deleteRes.success === true, 'CV berhasil dihapus');

    const checkDeletedRes = await fetch(`${BASE_URL}/cvs/${createdCvId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert(checkDeletedRes.status === 404, 'CV sudah tidak ada di database (Status 404)');

  } catch (err) {
    console.error('Error selama pengujian:', err);
    failed++;
  }

  console.log('\n=====================================================');
  console.log(`HASIL PENGUJIAN: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');
}

runTests();
