# Implementasi Website Generator CV sebagai Solusi Otomatisasi Pembuatan Dokumen Lamaran Kerja Menggunakan Metode Waterfall

Proyek penelitian/tugas akhir akademik pengembangan aplikasi web **CV Generator** berbasis arsitektur **Client-Server 3-Tier** yang dirancang secara sistematis menggunakan metode pengembangan perangkat lunak **Waterfall**.

---

## 📋 Ikhtisar Tahapan Waterfall

```text
[1] Requirement Analysis  ──>  [2] System Design  ──>  [3] Implementation  ──>  [4] Testing  ──>  [5] Deployment  ──>  [6] Maintenance
```

1. **Tahap 1 — Requirement Analysis:** Identifikasi kebutuhan fungsional (FR-01 s/d FR-11) dan non-fungsional (NFR: performa, keamanan Bcrypt & JWT, responsivitas, dan standar rasio dokumen A4).
2. **Tahap 2 — System Design:** Pemodelan basis data ternormalisasi (3NF - 13 tabel relasional), Entity Relationship Diagram (ERD), perancangan RESTful API, dan antarmuka UI/UX.
3. **Tahap 3 — Implementation:** 
   - **Frontend:** React 18 (Vite), Tailwind CSS, Lucide React, Axios, React Router v7, A4 print engine.
   - **Backend:** Node.js, Express.js REST API, JSON Web Token (JWT), Bcrypt password hashing, Multer file upload.
   - **Database:** MySQL / MariaDB (InnoDB engine, relasi Foreign Key dengan `ON DELETE CASCADE`).
4. **Tahap 4 — Testing:** Pengujian fungsional dan integrasi otomatis (*Black-Box Testing*) pada seluruh alur autentikasi, transaksi 11 section data, isolasi hak akses, dan *data reusability*.
5. **Tahap 5 — Deployment:** Konfigurasi environment variabel `.env` dan kesiapan build produksi (`npm run build`).
6. **Tahap 6 — Maintenance:** Arsitektur modular memisahkan controller, middleware, service, serta komponen template yang mudah dikembangkan.

---

## 🎨 3 Pilihan Template CV Standar Industri
Sistem mendukung prinsip **Data Reusability**: pengguna cukup menginput data satu kali dan dapat berganti template visual seketika tanpa kehilangan data.

1. **Template Modern (Tech & Creative):**
   - Format 2 kolom asimetris dengan sidebar info profil, kontak, keahlian teknis/soft skills, bahasa, dan sertifikasi.
   - Cocok untuk programmer, desainer, dan startup.
2. **Template Professional (Classic Corporate):**
   - Format 1 kolom formal dengan garis batas tegas dan palet navy elegan.
   - Cocok untuk korporat, BUMN, perbankan, dan posisi manajerial.
3. **Template Minimalist (Clean ATS-Friendly):**
   - Format ultra-bersih tanpa ornamen grafis berat, mengutamakan keterbacaan teks dan lolos screening mesin ATS.
   - Cocok untuk fresh graduate, akademisi, dan multi-bidang.

---

## 🗄️ Struktur Basis Data (13 Tabel Ternormalisasi 3NF)

- `users`: Master data pengguna (ID, nama, email unik, password ter-hash).
- `templates`: Master katalog template CV (*modern, professional, minimalist*).
- `cvs`: Master dokumen CV yang dimiliki pengguna (`user_id` FK).
- `personal_information`: Data kontak dan foto profil (1:1 dengan CV).
- `educations`: Riwayat pendidikan (1:N).
- `work_experiences`: Pengalaman kerja profesional (1:N).
- `internships`: Pengalaman magang / PKL (1:N).
- `organizations`: Riwayat kegiatan organisasi (1:N).
- `skills`: Keterampilan teknis (*hard*) dan interpersonal (*soft*) beserta levelnya (1:N).
- `certifications`: Sertifikat kompetensi dan tautan kredensial (1:N).
- `languages`: Kemampuan bahasa dan tingkat kemahiran (1:N).
- `achievements`: Penghargaan dan prestasi (1:N).
- `projects`: Portofolio karya dan tautan GitHub/Demo (1:N).

---

## 🚀 Panduan Menjalankan Sistem Secara Lokal

### 1. Prasyarat
- **Node.js** (v18 ke atas) & **npm**
- **MySQL / XAMPP / MariaDB** aktif pada port 3306

### 2. Konfigurasi Basis Data
Import skema SQL yang terdapat pada `backend/sql/schema.sql` ke MySQL:
```bash
mysql -u root -p < backend/sql/schema.sql
```
*(Atau import melalui phpMyAdmin pada database `cv_generator_db`)*

### 3. Menjalankan Backend (Port 5000)
```bash
cd backend
npm install
npm start
```
Server API akan aktif di: `http://localhost:5000/api`

### 4. Menjalankan Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Buka browser dan akses: `http://localhost:5173`

---

## 🧪 Hasil Pengujian Otomatis (Black-Box Testing)
Pengujian integrasi otomatis dijalankan melalui script `backend/test_waterfall_flow.js`:

```text
=====================================================
🧪 HASIL PENGUJIAN INTEGRASI METODE WATERFALL
=====================================================
[1/10] Pengujian Modul Registrasi Akun...           ✓ PASS
[2/10] Pengujian Validasi Email Duplikat...         ✓ PASS
[3/10] Pengujian Login & Penerbitan JWT Token...    ✓ PASS
[4/10] Pengujian Pengambilan Daftar Template CV...  ✓ PASS
[5/10] Pengujian Inisialisasi CV Baru...            ✓ PASS
[6/10] Pengujian Transaksi Atomik 11 Section CV...  ✓ PASS
[7/10] Pengujian Integritas Relasi Child 3NF...     ✓ PASS
[8/10] Pengujian Ganti Template (Data Reusable)...  ✓ PASS
[9/10] Pengujian Keamanan & Isolasi Data Akun...    ✓ PASS
[10/10] Pengujian Hapus CV & Cascade Delete...      ✓ PASS

STATUS: 17 PASSED, 0 FAILED (100% SUKSES)
=====================================================
```
