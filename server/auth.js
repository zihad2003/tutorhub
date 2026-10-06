const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const FILE_TYPES = {
  tutor: ['pdf', 'doc', 'docx'],
  parent: ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif'],
};

async function ensurePlatformTables() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS subjects (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      icon VARCHAR(16) DEFAULT '',
      description VARCHAR(255) DEFAULT ''
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS support_messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS tutor_certificates (
      id INT PRIMARY KEY AUTO_INCREMENT,
      tutor_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      file_url VARCHAR(500) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      uploaded_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS admins (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  );
  const subjects = [
    ['Physics', '⚛️', 'Science and board exam preparation'],
    ['Math', '📐', 'General math and higher math'],
    ['Chemistry', '🧪', 'Chemistry for school and college'],
    ['English', '📚', 'English reading, writing, and grammar'],
    ['Biology', '🧬', 'Biology for school and medical prep'],
    ['ICT', '💻', 'ICT and computer studies'],
    ['Bangla', '📝', 'Bangla language and literature'],
  ];
  for (const [name, icon, description] of subjects) {
    await pool.query(
      'INSERT IGNORE INTO subjects (name, icon, description) VALUES (?, ?, ?)',
      [name, icon, description]
    );
  }
  const tutorSubjects = [
    ['Rafiq Ahmed', 'Physics'],
    ['Rafiq Ahmed', 'Math'],
    ['Farhana Islam', 'English'],
    ['Farhana Islam', 'Bangla'],
    ['Shakil Hasan', 'Chemistry'],
    ['Shakil Hasan', 'Biology'],
  ];
  for (const [tutorName, subjectName] of tutorSubjects) {
    await pool.query(
      `INSERT IGNORE INTO tutor_subjects (tutor_id, subject_name)
       SELECT id, ? FROM tutors WHERE name = ? LIMIT 1`,
      [subjectName, tutorName]
    );
  }
  const [existing] = await pool.query(
    'SELECT id FROM admins WHERE email = ? LIMIT 1',
    ['superadmin@tutorhub.bd']
  );
  if (!existing.length) {
    await pool.query(
      'INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Super Admin', 'superadmin@tutorhub.bd', hashPassword('87654321a'), 'superadmin']
    );
  }
}

async function ensureAccountColumns() {
  const statements = [
    'ALTER TABLE tutors ADD COLUMN password_hash VARCHAR(255) NULL',
    'ALTER TABLE parents ADD COLUMN password_hash VARCHAR(255) NULL',
    'ALTER TABLE tutors ADD COLUMN max_students INT NULL',
    'ALTER TABLE lessons ADD COLUMN parent_id INT NULL',
  ];
  for (const sql of statements) {
    try {
      await pool.query(sql);
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error;
    }
  }
  await ensurePlatformTables();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash || hash.length !== 64) return false;
  const next = crypto.scryptSync(password, salt, 32);
  const current = Buffer.from(hash, 'hex');
  if (next.length !== current.length) return false;
  return crypto.timingSafeEqual(next, current);
}

function cleanName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function validateName(name) {
  if (!name) return 'Full name is required.';
  if (/\d/.test(name)) return 'Name cannot contain numbers.';
  if (name.length < 2 || name.length > 60) return 'Name must be between 2 and 60 characters.';
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
  return '';
}

function validateEmail(email, { requireGmail = false } = {}) {
  if (!email) return 'Email is required.';
  if (email.length > 254 || /\s/.test(email)) return 'Enter a valid email like name@gmail.com.';
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email)) {
    return 'Enter a valid email like name@gmail.com.';
  }
  const tld = email.split('.').pop();
  if (!tld || !/^[A-Za-z]{2,}$/.test(tld)) return 'Enter a valid email like name@gmail.com.';
  if (requireGmail && !email.endsWith('@gmail.com')) return 'Email must end with @gmail.com.';
  return '';
}

function validatePassword(password, email, name) {
  if (!password) return 'Password is required.';
  if (!String(password).trim()) return 'Password cannot be only spaces.';
  if (password.length < 8 || password.length > 128) return 'Password must be between 8 and 128 characters.';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Password must include at least one letter and one number.';
  if (password.trim().toLowerCase() === email || password.trim().toLowerCase() === name.toLowerCase()) {
    return 'Password cannot match your name or email.';
  }
  return '';
}

function extensionOf(fileName) {
  const parts = String(fileName || '').toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function saveDocument(file, role) {
  if (!file || typeof file !== 'object') return { error: role === 'tutor' ? 'Upload your CV as a PDF or Word document.' : 'Upload a student ID as an image or PDF.' };
  const extension = extensionOf(file.name);
  if (!FILE_TYPES[role].includes(extension)) {
    return {
      error: role === 'tutor'
        ? 'CV must be a PDF or Word file (.pdf, .doc, .docx).'
        : 'Student ID must be an image or PDF (.jpg, .png, .webp, .gif, .pdf).',
    };
  }
  const base64 = String(file.base64 || '');
  if (!base64) return { error: 'The selected file is empty.' };
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length) return { error: 'The selected file is empty.' };
  if (buffer.length > MAX_FILE_BYTES) return { error: 'File must be 5 MB or smaller.' };
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
  return { url: `/api/uploads/${filename}` };
}

function dateOnly(value) {
  if (!value) return null;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function accountPayload(row, role) {
  return {
    id: row.id,
    role,
    name: row.name,
    email: row.email,
    status: row.status || 'pending',
    phone: row.phone || '',
    location: row.location || '',
    experience: row.experience || '',
    cvUrl: row.cvUrl || '',
    studentIdUrl: row.studentIdUrl || '',
    appliedDate: dateOnly(row.appliedDate),
    demo: false,
  };
}

async function findAccount(email) {
  const [tutors] = await pool.query(
    'SELECT id, name, email, phone, location, experience, cvUrl, status, appliedDate, password_hash FROM tutors WHERE LOWER(email) = ? LIMIT 1',
    [email]
  );
  if (tutors[0]) return { role: 'tutor', row: tutors[0] };
  const [parents] = await pool.query(
    'SELECT id, name, email, phone, location, studentIdUrl, status, appliedDate, password_hash FROM parents WHERE LOWER(email) = ? LIMIT 1',
    [email]
  );
  if (parents[0]) return { role: 'parent', row: parents[0] };
  return null;
}

function requireAdmin(req, res) {
  const role = req.get('x-actor-role');
  if (role !== 'admin' && role !== 'superadmin') {
    res.status(403).json({ error: 'Only an admin can review accounts.' });
    return false;
  }
  return true;
}

function requireSuperadmin(req, res) {
  if (req.get('x-actor-role') !== 'superadmin') {
    res.status(403).json({ error: 'Only the super admin can manage admins.' });
    return false;
  }
  return true;
}

router.post('/register', async (req, res) => {
  try {
    const role = req.body?.role === 'tutor' ? 'tutor' : req.body?.role === 'parent' ? 'parent' : '';
    const name = cleanName(req.body?.name);
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const fields = {};
    if (!role) fields.role = 'Choose whether you are a parent or a tutor.';
    const nameError = validateName(name);
    const emailError = validateEmail(email, { requireGmail: true });
    const passwordError = role ? validatePassword(password, email, name) : 'Password is required.';
    if (nameError) fields.name = nameError;
    if (emailError) fields.email = emailError;
    if (passwordError) fields.password = passwordError;
    if (Object.keys(fields).length) return res.status(400).json({ error: 'Check the highlighted fields.', fields });

    const existing = await findAccount(email);
    if (existing && existing.row.status !== 'rejected') {
      return res.status(409).json({
        error: 'An account with this email already exists. Log in instead.',
        fields: { email: 'An account with this email already exists. Log in instead.' },
      });
    }
    if (existing && existing.role !== role) {
      return res.status(409).json({
        error: 'This email is already registered with a different role.',
        fields: { email: 'This email is already registered with a different role.' },
      });
    }

    const saved = saveDocument(req.body?.file, role);
    if (saved.error) return res.status(400).json({ error: saved.error, fields: { file: saved.error } });

    const passwordHash = hashPassword(password);
    let id = existing?.row.id;

    if (role === 'tutor') {
      if (existing) {
        await pool.query(
          `UPDATE tutors
           SET name = ?, password_hash = ?, cvUrl = ?, status = 'pending', verified = 0, appliedDate = CURDATE()
           WHERE id = ?`,
          [name, passwordHash, saved.url, id]
        );
      } else {
        const [result] = await pool.query(
          `INSERT INTO tutors (name, email, password_hash, cvUrl, status, verified, fee, rating, reviews, appliedDate)
           VALUES (?, ?, ?, ?, 'pending', 0, 0, 0, 0, CURDATE())`,
          [name, email, passwordHash, saved.url]
        );
        id = result.insertId;
      }
      const [rows] = await pool.query(
        'SELECT id, name, email, phone, location, experience, cvUrl, status, appliedDate FROM tutors WHERE id = ?',
        [id]
      );
      return res.status(201).json(accountPayload(rows[0], 'tutor'));
    }

    if (existing) {
      await pool.query(
        `UPDATE parents
         SET name = ?, password_hash = ?, studentIdUrl = ?, status = 'pending', appliedDate = CURDATE()
         WHERE id = ?`,
        [name, passwordHash, saved.url, id]
      );
    } else {
      const [result] = await pool.query(
        `INSERT INTO parents (name, email, password_hash, studentIdUrl, status, appliedDate)
         VALUES (?, ?, ?, ?, 'pending', CURDATE())`,
        [name, email, passwordHash, saved.url]
      );
      id = result.insertId;
    }
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, location, studentIdUrl, status, appliedDate FROM parents WHERE id = ?',
      [id]
    );
    return res.status(201).json(accountPayload(rows[0], 'parent'));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'An account with this email already exists. Log in instead.',
        fields: { email: 'An account with this email already exists. Log in instead.' },
      });
    }
    console.error(error);
    const message = error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST'
      ? 'The database is not running. Start MySQL and try again.'
      : error.code === 'ER_BAD_FIELD_ERROR'
        ? 'The account table is missing a column. Restart the TutorHub API and try again.'
        : 'Could not create the account. Please try again.';
    return res.status(500).json({ error: message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const gmailLogin = email.endsWith('@gmail.com');
    const emailError = validateEmail(email, { requireGmail: false });
    if (emailError) return res.status(400).json({ error: emailError, fields: { email: emailError } });
    if (!gmailLogin && !email.endsWith('@tutorhub.bd')) {
      const message = 'Email must end with @gmail.com.';
      return res.status(400).json({ error: message, fields: { email: message } });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Password is required.', fields: { password: 'Password is required.' } });
    }

    if (gmailLogin) {
      const account = await findAccount(email);
      if (account && verifyPassword(password, account.row.password_hash)) {
        return res.json(accountPayload(account.row, account.role));
      }
    }
    const [admins] = await pool.query(
      'SELECT id, name, email, password_hash, role FROM admins WHERE LOWER(email) = ? LIMIT 1',
      [email]
    );
    if (!admins[0] || !verifyPassword(password, admins[0].password_hash)) {
      return res.status(401).json({
        error: 'Incorrect email or password.',
        fields: { password: 'Incorrect email or password.' },
      });
    }
    return res.json({
      id: admins[0].id,
      role: admins[0].role === 'superadmin' ? 'superadmin' : 'admin',
      name: admins[0].name,
      email: admins[0].email,
      status: 'approved',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not log in. Please try again.' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const role = req.query.role === 'parent' ? 'parent' : req.query.role === 'tutor' ? 'tutor' : '';
    const id = Number(req.query.id);
    if (!role || !Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'A valid account is required.' });
    }
    const table = role === 'tutor' ? 'tutors' : 'parents';
    const columns = role === 'tutor'
      ? 'id, name, email, phone, location, experience, cvUrl, status, appliedDate'
      : 'id, name, email, phone, location, studentIdUrl, status, appliedDate';
    const [rows] = await pool.query(`SELECT ${columns} FROM ${table} WHERE id = ? LIMIT 1`, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Account not found.' });
    return res.json(accountPayload(rows[0], role));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not load the account.' });
  }
});

router.get('/directory', async (req, res) => {
  try {
    const [tutors] = await pool.query(
      'SELECT id, name, email, status, verified, experience FROM tutors ORDER BY id DESC'
    );
    const [parents] = await pool.query(
      'SELECT id, name, email, status FROM parents ORDER BY id DESC'
    );
    res.json({ tutors, parents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load accounts.' });
  }
});

router.get('/pending/:role', async (req, res) => {
  try {
    if (req.params.role === 'tutors') {
      const [rows] = await pool.query(
        `SELECT id, name, email, phone, location, experience, cvUrl, status, appliedDate, img
         FROM tutors WHERE status = 'pending' ORDER BY appliedDate DESC, id DESC`
      );
      return res.json(rows.map((row) => ({ ...accountPayload(row, 'tutor'), img: row.img || '', subjects: [], certificates: [] })));
    }
    if (req.params.role === 'parents') {
      const [rows] = await pool.query(
        `SELECT id, name, email, phone, location, studentIdUrl, status, appliedDate
         FROM parents WHERE status = 'pending' ORDER BY appliedDate DESC, id DESC`
      );
      return res.json(rows.map((row) => accountPayload(row, 'parent')));
    }
    return res.status(404).json({ error: 'Unknown approval queue.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not load pending accounts.' });
  }
});

async function reviewTutor(req, res, status) {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Choose a valid tutor.' });
  try {
    const [existing] = await pool.query('SELECT id, status FROM tutors WHERE id = ? LIMIT 1', [id]);
    if (!existing[0]) return res.status(404).json({ error: 'This tutor account no longer exists.' });
    if (existing[0].status === status) return res.json({ id, status, already: true });
    if (status === 'approved' && existing[0].status === 'rejected') {
      // An admin can approve a tutor who was previously rejected.
    }
    if (status === 'rejected' && existing[0].status === 'approved') {
      return res.status(409).json({ error: 'This tutor is already approved.' });
    }
    await pool.query(
      'UPDATE tutors SET status = ?, verified = ? WHERE id = ?',
      [status, status === 'approved' ? 1 : 0, id]
    );
    return res.json({ id, status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not update this tutor.' });
  }
}

router.post('/tutors/:id/approve', (req, res) => reviewTutor(req, res, 'approved'));
router.post('/tutors/:id/reject', (req, res) => reviewTutor(req, res, 'rejected'));

router.post('/parents/:id/approve', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Choose a valid parent.' });
  try {
    const [existing] = await pool.query('SELECT id, status FROM parents WHERE id = ? LIMIT 1', [id]);
    if (!existing[0]) return res.status(404).json({ error: 'This parent account no longer exists.' });
    if (existing[0].status === 'approved') return res.json({ id, status: 'approved', already: true });
    await pool.query("UPDATE parents SET status = 'approved' WHERE id = ?", [id]);
    return res.json({ id, status: 'approved' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not update this parent.' });
  }
});

router.post('/parents/:id/reject', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Choose a valid parent.' });
  try {
    const [existing] = await pool.query('SELECT id, status FROM parents WHERE id = ? LIMIT 1', [id]);
    if (!existing[0]) return res.status(404).json({ error: 'This parent account no longer exists.' });
    if (existing[0].status === 'approved') return res.status(409).json({ error: 'This parent is already approved.' });
    if (existing[0].status === 'rejected') return res.json({ id, status: 'rejected', already: true });
    await pool.query("UPDATE parents SET status = 'rejected' WHERE id = ?", [id]);
    return res.json({ id, status: 'rejected' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not update this parent.' });
  }
});

router.get('/admins', async (req, res) => {
  if (!requireSuperadmin(req, res)) return;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM admins WHERE role = 'admin' ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load admins.' });
  }
});

router.post('/admins', async (req, res) => {
  if (!requireSuperadmin(req, res)) return;
  try {
    const name = cleanName(req.body?.name) || 'Admin';
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const emailError = validateEmail(email, { requireGmail: true });
    const passwordError = validatePassword(password, email, name);
    const fields = {};
    if (emailError) fields.email = emailError;
    if (passwordError) fields.password = passwordError;
    if (Object.keys(fields).length) return res.status(400).json({ error: 'Check the highlighted fields.', fields });
    const [result] = await pool.query(
      "INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
      [name, email, hashPassword(password)]
    );
    res.status(201).json({ id: result.insertId, name, email, role: 'admin' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An admin with this email already exists.', fields: { email: 'An admin with this email already exists.' } });
    }
    console.error(error);
    res.status(500).json({ error: 'Could not create the admin.' });
  }
});

router.delete('/admins/:id', async (req, res) => {
  if (!requireSuperadmin(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Choose a valid admin.' });
  try {
    const [rows] = await pool.query('SELECT id, role, email FROM admins WHERE id = ? LIMIT 1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'This admin no longer exists.' });
    if (rows[0].role !== 'admin') return res.status(403).json({ error: 'The super admin account cannot be deleted.' });
    await pool.query("DELETE FROM admins WHERE id = ? AND role = 'admin'", [id]);
    return res.json({ id, email: rows[0].email, deleted: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not delete this admin.' });
  }
});

router.patch('/profile', async (req, res) => {
  try {
    const role = req.body?.role === 'tutor' ? 'tutor' : req.body?.role === 'parent' ? 'parent' : '';
    const id = Number(req.body?.id);
    const name = cleanName(req.body?.name);
    const phone = String(req.body?.phone || '').trim();
    const currentPassword = String(req.body?.currentPassword || '');
    const newPassword = String(req.body?.newPassword || '');
    if (!role || !Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'A valid account is required.' });
    }
    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ error: nameError, fields: { name: nameError } });
    const table = role === 'tutor' ? 'tutors' : 'parents';
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Account not found.' });
    let passwordHash = rows[0].password_hash;
    if (newPassword) {
      if (!verifyPassword(currentPassword, rows[0].password_hash)) {
        return res.status(401).json({ error: 'Current password is incorrect.', fields: { currentPassword: 'Current password is incorrect.' } });
      }
      const passwordError = validatePassword(newPassword, rows[0].email, name);
      if (passwordError) return res.status(400).json({ error: passwordError, fields: { newPassword: passwordError } });
      passwordHash = hashPassword(newPassword);
    }
    await pool.query(
      `UPDATE ${table} SET name = ?, phone = ?, password_hash = ? WHERE id = ?`,
      [name, phone, passwordHash, id]
    );
    const [updated] = await pool.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id]);
    return res.json(accountPayload(updated[0], role));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not update the account.' });
  }
});

module.exports = { router, ensureAccountColumns };
