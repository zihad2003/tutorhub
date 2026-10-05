const express = require('express');
const router = express.Router();
const pool = require('./db');

function asNumber(value) {
  if (value === null || value === undefined || value === '') return value;
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

function dateOnly(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Example endpoint to get tutors
router.get('/tutors', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, location, experience, fee, rating, reviews, verified, img, bio, availability, cvUrl, status, appliedDate
       FROM tutors
       WHERE status = 'approved'`
    );
    const [subjectRows] = await pool.query('SELECT tutor_id, subject_name FROM tutor_subjects');
    const subjectsByTutor = {};
    for (const subject of subjectRows) {
      if (!subjectsByTutor[subject.tutor_id]) subjectsByTutor[subject.tutor_id] = [];
      subjectsByTutor[subject.tutor_id].push(subject.subject_name);
    }
    res.json(rows.map((row) => ({
      ...row,
      fee: asNumber(row.fee),
      rating: asNumber(row.rating),
      subjects: subjectsByTutor[row.id] || [],
      certificates: [],
      revs: [],
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function shapeLesson(row) {
  return {
    ...row,
    tutorId: row.tutor_id,
    parentId: row.parent_id,
    hiredTutorId: row.hired_tutor_id,
    tutorName: row.tutorName || 'Tutor',
    parentName: row.parentName || '',
    date: dateOnly(row.date),
    fee: asNumber(row.fee),
  };
}

function shapeRequest(row) {
  return {
    ...row,
    parentId: row.parent_id,
    postedDate: dateOnly(row.postedDate),
  };
}

function shapePayment(row) {
  return {
    ...row,
    parentId: row.parent_id,
    totalAmount: asNumber(row.totalAmount),
    paidDate: dateOnly(row.paidDate),
    dueDate: dateOnly(row.dueDate),
  };
}

function shapeEarning(row) {
  return {
    ...row,
    tutorId: row.tutor_id,
    totalEarnings: asNumber(row.totalEarnings),
    paidDate: dateOnly(row.paidDate),
  };
}

function shapeHired(row) {
  const subjects = Array.isArray(row.subjects)
    ? row.subjects
    : String(row.subjects || '').split(',').map((item) => item.trim()).filter(Boolean);
  return {
    ...row,
    tutorId: row.tutor_id,
    parentId: row.parent_id,
    tutorName: row.tutorName || 'Tutor',
    parentName: row.parentName || '',
    subjects,
    fee: asNumber(row.fee),
    hireDate: dateOnly(row.hireDate),
  };
}

router.get('/lessons', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, t.name AS joinedTutorName, p.name AS parentName
       FROM lessons l
       LEFT JOIN tutors t ON t.id = l.tutor_id
       LEFT JOIN parents p ON p.id = l.parent_id
       ORDER BY l.date DESC, l.id DESC`
    );
    res.json(rows.map((row) => shapeLesson({ ...row, tutorName: row.joinedTutorName || row.tutorName })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/lessons', async (req, res) => {
  try {
    const subject = String(req.body.subject || '').trim();
    const topic = String(req.body.topic || '').trim();
    const date = String(req.body.date || '').trim();
    if (!subject || !topic || !date) {
      return res.status(400).json({ error: 'Subject, topic, and date are required.' });
    }
    const tutorId = Number(req.body.tutorId) || null;
    const parentId = Number(req.body.parentId) || null;
    let hiredTutorId = Number(req.body.hiredTutorId) || null;
    let fee = req.body.fee || null;
    if (tutorId && parentId) {
      const [hireRows] = await pool.query(
        `SELECT id, fee FROM hired_tutors
         WHERE tutor_id = ? AND parent_id = ? AND status = 'active'
           AND (? IS NULL OR id = ?)
         LIMIT 1`,
        [tutorId, parentId, hiredTutorId, hiredTutorId]
      );
      if (!hireRows[0]) {
        return res.status(403).json({ error: 'This student is not hired with you.' });
      }
      fee = asNumber(hireRows[0].fee);
      hiredTutorId = hireRows[0].id;
    }
    const [result] = await pool.query(
      `INSERT INTO lessons (hired_tutor_id, tutor_id, parent_id, subject, topic, date, classLevel, duration, homework, notes, status, fee)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        hiredTutorId,
        tutorId,
        parentId,
        subject,
        topic,
        date,
        req.body.classLevel || null,
        req.body.duration || null,
        req.body.homework || null,
        req.body.notes || null,
        fee,
      ]
    );
    if (hiredTutorId) {
      await pool.query('UPDATE hired_tutors SET totalLessons = totalLessons + 1 WHERE id = ?', [hiredTutorId]);
    }
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/lessons/:id', async (req, res) => {
  try {
    const status = req.body.status;
    if (!['pending', 'confirmed', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid lesson status.' });
    }
    const [result] = await pool.query('UPDATE lessons SET status = ? WHERE id = ?', [status, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Lesson not found.' });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/requests', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM requests ORDER BY id DESC');
    res.json(rows.map(shapeRequest));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/requests', async (req, res) => {
  try {
    const subject = String(req.body.subject || '').trim();
    if (!subject) return res.status(400).json({ error: 'Subject is required.' });
    const [result] = await pool.query(
      `INSERT INTO requests (parent_id, subject, classLevel, location, budget, preferredDays, preferredTime, description, postedDate, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'open')`,
      [
        req.body.parentId || null,
        subject,
        req.body.classLevel || null,
        req.body.location || null,
        req.body.budget || null,
        req.body.preferredDays || null,
        req.body.preferredTime || null,
        req.body.description || null,
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categories endpoint
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/parents', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, location, studentIdUrl, status, appliedDate
       FROM parents
       WHERE status = 'approved'`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const [[tutors]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending FROM tutors`
    );
    const [[parents]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending FROM parents`
    );
    const [[lessons]] = await pool.query(
      `SELECT COUNT(*) AS total,
              SUM(status IN ('confirmed', 'completed')) AS completed
       FROM lessons`
    );
    const [[payments]] = await pool.query(
      `SELECT COALESCE(SUM(CASE WHEN status = 'paid' THEN totalAmount ELSE 0 END), 0) AS paid
       FROM payments`
    );
    res.json({
      tutors: Number(tutors.total) || 0,
      pendingTutors: Number(tutors.pending) || 0,
      parents: Number(parents.total) || 0,
      pendingParents: Number(parents.pending) || 0,
      lessons: Number(lessons.total) || 0,
      completedLessons: Number(lessons.completed) || 0,
      paidRevenue: Number(payments.paid) || 0,
      activeUsers: (Number(tutors.total) || 0) + (Number(parents.total) || 0),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/subjects', async (req, res) => {
  try {
    const [subjects] = await pool.query('SELECT id, name, icon, description FROM subjects ORDER BY name');
    const [links] = await pool.query('SELECT subject_name, COUNT(*) AS tutors FROM tutor_subjects GROUP BY subject_name');
    const counts = {};
    for (const link of links) counts[link.subject_name] = Number(link.tutors) || 0;
    res.json(subjects.map((subject) => ({
      ...subject,
      tutors: counts[subject.name] || 0,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/support-messages', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, message, created_at FROM support_messages ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/support-messages', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const message = String(req.body.message || '').trim();
    if (!name || !email.endsWith('@gmail.com') || message.length < 5) {
      return res.status(400).json({ error: 'Enter your name, a Gmail address, and a message.' });
    }
    const [result] = await pool.query(
      'INSERT INTO support_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tutor-profile/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, location, experience, fee, rating, reviews, verified, img, bio, availability, max_students, status
       FROM tutors WHERE id = ? LIMIT 1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Tutor not found.' });
    const [subjectRows] = await pool.query(
      'SELECT subject_name FROM tutor_subjects WHERE tutor_id = ?',
      [req.params.id]
    );
    res.json({
      ...rows[0],
      fee: asNumber(rows[0].fee),
      rating: asNumber(rows[0].rating),
      maxStudents: rows[0].max_students,
      subjects: subjectRows.map((row) => row.subject_name),
      certificates: [],
      revs: [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const TEACHING_DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TEACHING_TIMES = [
  'Morning (8:00 AM - 12:00 PM)',
  'Afternoon (12:00 PM - 4:00 PM)',
  'Evening (4:00 PM - 8:00 PM)',
  'Night (8:00 PM - 10:00 PM)',
];

router.patch('/tutors/:id/availability', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Choose a tutor account.' });
  const days = Array.isArray(req.body.days)
    ? [...new Set(req.body.days.map((day) => String(day).trim()).filter((day) => TEACHING_DAYS.includes(day)))]
    : [];
  const time = String(req.body.time || '').trim();
  const maxStudents = Number(req.body.maxStudents);
  const subjects = Array.isArray(req.body.subjects)
    ? [...new Set(req.body.subjects.map((subject) => String(subject).trim()).filter(Boolean))]
    : [];
  const fee = moneyAmount(req.body.salary);
  if (!days.length) return res.status(400).json({ error: 'Select at least one teaching day.' });
  if (!TEACHING_TIMES.includes(time)) return res.status(400).json({ error: 'Select a teaching time.' });
  if (![2, 4, 6, 8].includes(maxStudents)) return res.status(400).json({ error: 'Select how many students you can teach.' });
  if (!subjects.length) return res.status(400).json({ error: 'Select at least one subject you can teach.' });
  if (fee < 5000 || fee > 10000) return res.status(400).json({ error: 'Expected monthly salary must be between ৳5,000 and ৳10,000.' });
  try {
    const [tutors] = await pool.query('SELECT id FROM tutors WHERE id = ? LIMIT 1', [id]);
    if (!tutors[0]) return res.status(404).json({ error: 'Tutor account not found.' });
    const [known] = await pool.query('SELECT name FROM subjects');
    const knownNames = new Set(known.map((row) => row.name));
    if (subjects.some((subject) => !knownNames.has(subject))) {
      return res.status(400).json({ error: 'Choose subjects from the TutorHub list.' });
    }
    const availability = `${days.join(', ')} | ${time} | ${maxStudents} students`;
    await pool.query(
      'UPDATE tutors SET fee = ?, availability = ?, max_students = ? WHERE id = ?',
      [fee, availability, maxStudents, id]
    );
    await pool.query('DELETE FROM tutor_subjects WHERE tutor_id = ?', [id]);
    for (const subject of subjects) {
      await pool.query('INSERT INTO tutor_subjects (tutor_id, subject_name) VALUES (?, ?)', [id, subject]);
    }
    res.json({ id, fee, availability, maxStudents, subjects, days, time });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function recordHireBilling(parentId, tutorId, subject, fee) {
  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const label = `${month} · ${subject || 'Tuition'}`;
  const [existingPay] = await pool.query(
    "SELECT id FROM payments WHERE parent_id = ? AND month = ? LIMIT 1",
    [parentId, label]
  );
  if (!existingPay[0]) {
    await pool.query(
      `INSERT INTO payments (parent_id, month, totalLessons, totalAmount, status, dueDate)
       VALUES (?, ?, 0, ?, 'pending', LAST_DAY(CURDATE()))`,
      [parentId, label, fee]
    );
  }
  const [existingEarn] = await pool.query(
    "SELECT id FROM tutor_earnings WHERE tutor_id = ? AND month = ? LIMIT 1",
    [tutorId, label]
  );
  if (!existingEarn[0]) {
    await pool.query(
      `INSERT INTO tutor_earnings (tutor_id, month, totalLessons, totalEarnings, status)
       VALUES (?, ?, 0, ?, 'pending')`,
      [tutorId, label, fee]
    );
  }
}

function moneyAmount(value) {
  const number = Number(String(value ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

router.get('/applications', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.request_id AS requestId, a.tutor_id AS tutorId, r.parent_id AS parentId,
              r.subject AS requestSubject, r.classLevel, r.budget, r.preferredDays, r.preferredTime,
              t.name AS tutorName, t.img AS tutorImg, t.experience, t.fee, t.rating,
              a.coverLetter, a.cvUrl, a.certificateUrl, a.status, a.appliedDate,
              (SELECT GROUP_CONCAT(ts.subject_name ORDER BY ts.subject_name SEPARATOR ',')
               FROM tutor_subjects ts WHERE ts.tutor_id = t.id) AS subjectList
       FROM applications a
       LEFT JOIN tutors t ON t.id = a.tutor_id
       LEFT JOIN requests r ON r.id = a.request_id
       ORDER BY a.id DESC`
    );
    res.json(rows.map((row) => ({
      ...row,
      fee: asNumber(row.fee),
      budget: row.budget || '',
      rating: asNumber(row.rating),
      subjects: String(row.subjectList || row.requestSubject || '').split(',').map((item) => item.trim()).filter(Boolean),
      appliedDate: dateOnly(row.appliedDate),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/applications', async (req, res) => {
  try {
    const requestId = Number(req.body.requestId);
    const tutorId = Number(req.body.tutorId);
    const coverLetter = String(req.body.coverLetter || '').trim();
    if (!requestId || !tutorId || !coverLetter) {
      return res.status(400).json({ error: 'A tutor account, request, and cover letter are required.' });
    }
    const [existing] = await pool.query(
      'SELECT id FROM applications WHERE request_id = ? AND tutor_id = ? LIMIT 1',
      [requestId, tutorId]
    );
    if (existing[0]) {
      return res.status(409).json({ error: 'You already applied to this request.' });
    }
    const [result] = await pool.query(
      `INSERT INTO applications (request_id, tutor_id, coverLetter, status, appliedDate)
       VALUES (?, ?, ?, 'pending', CURDATE())`,
      [requestId, tutorId, coverLetter]
    );
    await pool.query(
      'UPDATE requests SET applicationsCount = applicationsCount + 1 WHERE id = ?',
      [requestId]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/applications/:id/hire', async (req, res) => {
  const id = Number(req.params.id);
  const parentId = Number(req.body.parentId);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Choose an application.' });
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.tutor_id, a.status, a.request_id, r.parent_id, r.subject, r.budget, t.fee
       FROM applications a
       JOIN requests r ON r.id = a.request_id
       JOIN tutors t ON t.id = a.tutor_id
       WHERE a.id = ? LIMIT 1`,
      [id]
    );
    const application = rows[0];
    if (!application) return res.status(404).json({ error: 'This application no longer exists.' });
    if (parentId && Number(application.parent_id) !== parentId) {
      return res.status(403).json({ error: 'Only the parent who posted this request can hire.' });
    }
    const fee = moneyAmount(application.budget) || asNumber(application.fee);
    if (application.status !== 'hired') {
      await pool.query(
        `INSERT INTO hired_tutors (tutor_id, parent_id, subjects, fee, hireDate, totalLessons, status)
         VALUES (?, ?, ?, ?, CURDATE(), 0, 'active')`,
        [application.tutor_id, application.parent_id, application.subject || '', fee]
      );
      await recordHireBilling(application.parent_id, application.tutor_id, application.subject, fee);
      await pool.query("UPDATE applications SET status = 'hired' WHERE id = ?", [id]);
      await pool.query(
        "UPDATE applications SET status = 'rejected' WHERE request_id = ? AND id <> ? AND status = 'pending'",
        [application.request_id, id]
      );
      await pool.query("UPDATE requests SET status = 'hired' WHERE id = ?", [application.request_id]);
    }
    res.json({ id, status: 'hired', tutorId: application.tutor_id, parentId: application.parent_id, fee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payments ORDER BY id DESC');
    res.json(rows.map(shapePayment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/hired_tutors', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT h.*, t.name AS tutorName, t.img AS tutorImg, p.name AS parentName
       FROM hired_tutors h
       LEFT JOIN tutors t ON t.id = h.tutor_id
       LEFT JOIN parents p ON p.id = h.parent_id
       ORDER BY h.id DESC`
    );
    res.json(rows.map(shapeHired));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tutor_earnings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tutor_earnings ORDER BY id DESC');
    res.json(rows.map(shapeEarning));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chats', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, t.name AS tutorName, t.img AS tutorImg, p.name AS parentName
       FROM chats c
       LEFT JOIN tutors t ON t.id = c.tutor_id
       LEFT JOIN parents p ON p.id = c.parent_id
       ORDER BY c.id DESC`
    );
    const [messages] = await pool.query('SELECT * FROM messages ORDER BY id');
    const byChat = {};
    for (const message of messages) {
      if (!byChat[message.chat_id]) byChat[message.chat_id] = [];
      byChat[message.chat_id].push({
        id: message.id,
        sender: message.sender,
        text: message.text,
        time: message.time || '',
      });
    }
    res.json(rows.map((row) => ({
      ...row,
      tutorId: row.tutor_id,
      parentId: row.parent_id,
      name: row.parentName || row.tutorName || 'Conversation',
      messages: byChat[row.id] || [],
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function shapeWithdrawal(row) {
  return {
    ...row,
    tutorId: row.tutor_id,
    amount: asNumber(row.amount),
    requestedDate: dateOnly(row.requestedDate),
    processedDate: dateOnly(row.processedDate),
  };
}

router.get('/withdrawal_requests', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT w.*, t.name AS tutorName, t.img AS tutorImg
       FROM withdrawal_requests w
       LEFT JOIN tutors t ON t.id = w.tutor_id
       ORDER BY w.id DESC`
    );
    res.json(rows.map(shapeWithdrawal));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/withdrawal_requests', async (req, res) => {
  const tutorId = Number(req.body.tutorId);
  const amount = moneyAmount(req.body.amount);
  const method = req.body.method === 'Bank Transfer' ? 'Bank Transfer' : req.body.method === 'bKash' ? 'bKash' : '';
  const accountNumber = String(req.body.accountNumber || '').trim();
  const bankName = method === 'Bank Transfer' ? String(req.body.bankName || '').trim() : null;
  const branch = method === 'Bank Transfer' ? String(req.body.branch || '').trim() : null;
  const notes = String(req.body.notes || '').trim();
  if (!Number.isInteger(tutorId) || tutorId <= 0) return res.status(400).json({ error: 'Choose a tutor account.' });
  if (!method) return res.status(400).json({ error: 'Choose bKash or a bank transfer.' });
  if (!accountNumber) return res.status(400).json({ error: 'Enter the account number.' });
  if (method === 'Bank Transfer' && (!bankName || !branch)) {
    return res.status(400).json({ error: 'Enter the bank name and branch.' });
  }
  if (amount <= 0) return res.status(400).json({ error: 'Enter a withdrawal amount.' });
  try {
    const [tutors] = await pool.query('SELECT id, name, img FROM tutors WHERE id = ? LIMIT 1', [tutorId]);
    if (!tutors[0]) return res.status(404).json({ error: 'Tutor account not found.' });
    const [earnings] = await pool.query(
      "SELECT COALESCE(SUM(totalEarnings), 0) AS total FROM tutor_earnings WHERE tutor_id = ? AND status = 'pending'",
      [tutorId]
    );
    const [openRequests] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM withdrawal_requests WHERE tutor_id = ? AND status = 'pending'",
      [tutorId]
    );
    const available = asNumber(earnings[0].total) - asNumber(openRequests[0].total);
    if (amount > available) {
      return res.status(400).json({ error: 'The amount is higher than the available balance.' });
    }
    const [result] = await pool.query(
      `INSERT INTO withdrawal_requests (tutor_id, amount, method, accountNumber, bankName, branch, requestedDate, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 'pending', ?)`,
      [tutorId, amount, method, accountNumber, bankName, branch, notes || null]
    );
    const [rows] = await pool.query(
      `SELECT w.*, t.name AS tutorName, t.img AS tutorImg
       FROM withdrawal_requests w
       LEFT JOIN tutors t ON t.id = w.tutor_id
       WHERE w.id = ? LIMIT 1`,
      [result.insertId]
    );
    res.status(201).json(shapeWithdrawal(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/withdrawal_requests/:id', async (req, res) => {
  const id = Number(req.params.id);
  const status = req.body.status === 'approved' ? 'approved' : req.body.status === 'rejected' ? 'rejected' : '';
  if (!Number.isInteger(id) || id <= 0 || !status) {
    return res.status(400).json({ error: 'Choose a withdrawal request.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM withdrawal_requests WHERE id = ? LIMIT 1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Withdrawal request not found.' });
    if (rows[0].status !== 'pending') {
      return res.status(409).json({ error: 'This request has already been processed.' });
    }
    await pool.query(
      'UPDATE withdrawal_requests SET status = ?, processedDate = CURDATE() WHERE id = ?',
      [status, id]
    );
    if (status === 'approved') {
      let remaining = asNumber(rows[0].amount);
      const [earnings] = await pool.query(
        "SELECT id, totalEarnings FROM tutor_earnings WHERE tutor_id = ? AND status = 'pending' ORDER BY id",
        [rows[0].tutor_id]
      );
      for (const earning of earnings) {
        if (remaining <= 0) break;
        const value = asNumber(earning.totalEarnings);
        if (value <= remaining) {
          await pool.query("UPDATE tutor_earnings SET status = 'paid', paidDate = CURDATE() WHERE id = ?", [earning.id]);
          remaining -= value;
        } else {
          await pool.query('UPDATE tutor_earnings SET totalEarnings = ? WHERE id = ?', [value - remaining, earning.id]);
          remaining = 0;
        }
      }
    }
    res.json({ id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function backfillHireBilling() {
  const [rows] = await pool.query(
    "SELECT parent_id, tutor_id, subjects, fee FROM hired_tutors WHERE status = 'active'"
  );
  for (const row of rows) {
    const subject = String(row.subjects || '').split(',')[0].trim();
    await recordHireBilling(row.parent_id, row.tutor_id, subject, asNumber(row.fee));
  }
}

router.backfillHireBilling = backfillHireBilling;
module.exports = router;
