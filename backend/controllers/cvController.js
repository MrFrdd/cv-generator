const pool = require('../config/database');

// 1. Get all CVs for current logged-in user
exports.getUserCVs = async (req, res) => {
    try {
        const userId = req.user.id;
        const [cvs] = await pool.query(
            `SELECT c.*, t.name as template_name, p.full_name, p.job_title, p.photo_url 
             FROM cvs c 
             LEFT JOIN templates t ON c.template_id = t.id 
             LEFT JOIN personal_information p ON c.id = p.cv_id 
             WHERE c.user_id = ? 
             ORDER BY c.updated_at DESC`,
            [userId]
        );

        return res.json({
            success: true,
            data: cvs
        });
    } catch (err) {
        console.error('Error saat mengambil daftar CV:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil daftar CV.'
        });
    }
};

// 2. Create new CV
exports.createCV = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const userId = req.user.id;
        const { title, template_id } = req.body;

        const cvTitle = title ? title.trim() : 'CV Baru';
        const template = template_id || 'modern';

        // Insert into cvs
        const [cvResult] = await conn.query(
            'INSERT INTO cvs (user_id, template_id, title, summary) VALUES (?, ?, ?, ?)',
            [userId, template, cvTitle, '']
        );
        const cvId = cvResult.insertId;

        // Inisialisasi personal_information dengan nama dan email user
        await conn.query(
            `INSERT INTO personal_information 
             (cv_id, full_name, email, job_title, phone, address, city, linkedin_url, github_url, portfolio_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [cvId, req.user.name || '', req.user.email || '', '', '', '', '', '', '', '']
        );

        await conn.commit();

        return res.status(201).json({
            success: true,
            message: 'CV baru berhasil dibuat!',
            data: {
                id: cvId,
                title: cvTitle,
                template_id: template
            }
        });
    } catch (err) {
        await conn.rollback();
        console.error('Error saat membuat CV:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal membuat CV baru.'
        });
    } finally {
        conn.release();
    }
};

// 3. Get single CV by ID with all sections
exports.getCVById = async (req, res) => {
    try {
        const userId = req.user.id;
        const cvId = req.params.id;

        // Verifikasi kepemilikan CV
        const [cvRows] = await pool.query(
            `SELECT c.*, t.name as template_name 
             FROM cvs c 
             LEFT JOIN templates t ON c.template_id = t.id 
             WHERE c.id = ? AND c.user_id = ? LIMIT 1`,
            [cvId, userId]
        );

        if (cvRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'CV tidak ditemukan atau Anda tidak memiliki akses.'
            });
        }

        const cv = cvRows[0];

        // Ambil personal_information
        const [personalRows] = await pool.query(
            'SELECT * FROM personal_information WHERE cv_id = ? LIMIT 1',
            [cvId]
        );
        const personalInfo = personalRows[0] || {};

        // Ambil semua section relasional
        const [educations] = await pool.query(
            'SELECT * FROM educations WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );
        const [workExperiences] = await pool.query(
            'SELECT * FROM work_experiences WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );
        const [internships] = await pool.query(
            'SELECT * FROM internships WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );
        const [organizations] = await pool.query(
            'SELECT * FROM organizations WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );
        const [skills] = await pool.query(
            'SELECT * FROM skills WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );
        const [certifications] = await pool.query(
            'SELECT * FROM certifications WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );
        const [languages] = await pool.query(
            'SELECT * FROM languages WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );
        const [achievements] = await pool.query(
            'SELECT * FROM achievements WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );
        const [projects] = await pool.query(
            'SELECT * FROM projects WHERE cv_id = ? ORDER BY order_index ASC, id ASC',
            [cvId]
        );

        return res.json({
            success: true,
            data: {
                cv,
                personal_information: personalInfo,
                educations,
                work_experiences: workExperiences,
                internships,
                organizations,
                skills,
                certifications,
                languages,
                achievements,
                projects
            }
        });
    } catch (err) {
        console.error('Error saat mengambil detail CV:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data CV.'
        });
    }
};

// 4. Update complete CV (Atomic Transaction across all 3NF tables)
exports.updateCV = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const userId = req.user.id;
        const cvId = req.params.id;

        // Verifikasi kepemilikan CV
        const [cvRows] = await conn.query(
            'SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1',
            [cvId, userId]
        );

        if (cvRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: 'CV tidak ditemukan atau Anda tidak memiliki akses.'
            });
        }

        const {
            title,
            template_id,
            summary,
            personal_information,
            educations,
            work_experiences,
            internships,
            organizations,
            skills,
            certifications,
            languages,
            achievements,
            projects
        } = req.body;

        // 1. Update tabel master cvs
        await conn.query(
            `UPDATE cvs 
             SET title = COALESCE(?, title), 
                 template_id = COALESCE(?, template_id), 
                 summary = COALESCE(?, summary),
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [title, template_id, summary, cvId]
        );

        // 2. Update / Insert personal_information
        if (personal_information) {
            const p = personal_information;
            await conn.query(
                `INSERT INTO personal_information 
                 (cv_id, full_name, job_title, photo_url, email, phone, address, city, linkedin_url, github_url, portfolio_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                 full_name = VALUES(full_name),
                 job_title = VALUES(job_title),
                 photo_url = VALUES(photo_url),
                 email = VALUES(email),
                 phone = VALUES(phone),
                 address = VALUES(address),
                 city = VALUES(city),
                 linkedin_url = VALUES(linkedin_url),
                 github_url = VALUES(github_url),
                 portfolio_url = VALUES(portfolio_url)`,
                [
                    cvId,
                    p.full_name || '',
                    p.job_title || '',
                    p.photo_url || '',
                    p.email || '',
                    p.phone || '',
                    p.address || '',
                    p.city || '',
                    p.linkedin_url || '',
                    p.github_url || '',
                    p.portfolio_url || ''
                ]
            );
        }

        // Helper untuk sync relasi 1:N
        // Hapus data lama, lalu masukkan array baru
        if (Array.isArray(educations)) {
            await conn.query('DELETE FROM educations WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < educations.length; i++) {
                const item = educations[i];
                if (item.institution) {
                    await conn.query(
                        `INSERT INTO educations (cv_id, institution, degree, major, start_year, end_year, gpa, description, order_index)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [cvId, item.institution, item.degree || '', item.major || '', item.start_year || '', item.end_year || '', item.gpa || '', item.description || '', i]
                    );
                }
            }
        }

        if (Array.isArray(work_experiences)) {
            await conn.query('DELETE FROM work_experiences WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < work_experiences.length; i++) {
                const item = work_experiences[i];
                if (item.company) {
                    await conn.query(
                        `INSERT INTO work_experiences (cv_id, company, position, location, start_date, end_date, is_current, description, order_index)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [cvId, item.company, item.position || '', item.location || '', item.start_date || '', item.end_date || '', item.is_current ? 1 : 0, item.description || '', i]
                    );
                }
            }
        }

        if (Array.isArray(internships)) {
            await conn.query('DELETE FROM internships WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < internships.length; i++) {
                const item = internships[i];
                if (item.company) {
                    await conn.query(
                        `INSERT INTO internships (cv_id, company, position, period, description, order_index)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [cvId, item.company, item.position || '', item.period || '', item.description || '', i]
                    );
                }
            }
        }

        if (Array.isArray(organizations)) {
            await conn.query('DELETE FROM organizations WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < organizations.length; i++) {
                const item = organizations[i];
                if (item.organization_name) {
                    await conn.query(
                        `INSERT INTO organizations (cv_id, organization_name, role, period, description, order_index)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [cvId, item.organization_name, item.role || '', item.period || '', item.description || '', i]
                    );
                }
            }
        }

        if (Array.isArray(skills)) {
            await conn.query('DELETE FROM skills WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < skills.length; i++) {
                const item = skills[i];
                if (item.skill_name) {
                    await conn.query(
                        `INSERT INTO skills (cv_id, skill_name, category, level, order_index)
                         VALUES (?, ?, ?, ?, ?)`,
                        [cvId, item.skill_name, item.category || 'hard', item.level || 'Intermediate', i]
                    );
                }
            }
        }

        if (Array.isArray(certifications)) {
            await conn.query('DELETE FROM certifications WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < certifications.length; i++) {
                const item = certifications[i];
                if (item.certificate_name) {
                    await conn.query(
                        `INSERT INTO certifications (cv_id, certificate_name, issuer, issue_year, credential_url, order_index)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [cvId, item.certificate_name, item.issuer || '', item.issue_year || '', item.credential_url || '', i]
                    );
                }
            }
        }

        if (Array.isArray(languages)) {
            await conn.query('DELETE FROM languages WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < languages.length; i++) {
                const item = languages[i];
                if (item.language_name) {
                    await conn.query(
                        `INSERT INTO languages (cv_id, language_name, proficiency, order_index)
                         VALUES (?, ?, ?, ?)`,
                        [cvId, item.language_name, item.proficiency || 'Fluent', i]
                    );
                }
            }
        }

        if (Array.isArray(achievements)) {
            await conn.query('DELETE FROM achievements WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < achievements.length; i++) {
                const item = achievements[i];
                if (item.title) {
                    await conn.query(
                        `INSERT INTO achievements (cv_id, title, issuer, year, description, order_index)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [cvId, item.title, item.issuer || '', item.year || '', item.description || '', i]
                    );
                }
            }
        }

        if (Array.isArray(projects)) {
            await conn.query('DELETE FROM projects WHERE cv_id = ?', [cvId]);
            for (let i = 0; i < projects.length; i++) {
                const item = projects[i];
                if (item.project_name) {
                    await conn.query(
                        `INSERT INTO projects (cv_id, project_name, tech_stack, github_link, demo_link, description, order_index)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [cvId, item.project_name, item.tech_stack || '', item.github_link || '', item.demo_link || '', item.description || '', i]
                    );
                }
            }
        }

        await conn.commit();

        return res.json({
            success: true,
            message: 'CV berhasil diperbarui dan disimpan!'
        });
    } catch (err) {
        await conn.rollback();
        console.error('Error saat update CV:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal menyimpan perubahan CV.'
        });
    } finally {
        conn.release();
    }
};

// 5. Update template CV only
exports.updateTemplate = async (req, res) => {
    try {
        const userId = req.user.id;
        const cvId = req.params.id;
        const { template_id } = req.body;

        if (!template_id) {
            return res.status(400).json({
                success: false,
                message: 'Template ID wajib disertakan.'
            });
        }

        const [result] = await pool.query(
            'UPDATE cvs SET template_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
            [template_id, cvId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'CV tidak ditemukan atau Anda tidak memiliki akses.'
            });
        }

        return res.json({
            success: true,
            message: 'Template berhasil diubah!'
        });
    } catch (err) {
        console.error('Error saat update template CV:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui template CV.'
        });
    }
};

// 6. Delete CV
exports.deleteCV = async (req, res) => {
    try {
        const userId = req.user.id;
        const cvId = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM cvs WHERE id = ? AND user_id = ?',
            [cvId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'CV tidak ditemukan atau Anda tidak memiliki akses.'
            });
        }

        return res.json({
            success: true,
            message: 'CV berhasil dihapus!'
        });
    } catch (err) {
        console.error('Error saat menghapus CV:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus CV.'
        });
    }
};
