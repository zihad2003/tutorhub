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
    tutorName: row.tutorName || 'Tutor',
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
    subjects,
    fee: asNumber(row.fee),
    hireDate: dateOnly(row.hireDate),
  };
}

router.get('/lessons', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, t.name AS joinedTutorName
       FROM lessons l
       LEFT JOIN tutors t ON t.id = l.tutor_id
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
    const [result] = await pool.query(
      `INSERT INTO lessons (tutor_id, subject, topic, date, classLevel, duration, homework, notes, status, fee)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        req.body.tutorId || null,
        subject,
        topic,
        date,
        req.body.classLevel || null,
        req.body.duration || null,
        req.body.homework || null,
        req.body.notes || null,
        req.body.fee || null,
      ]
    );
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

router.get('/applications', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.request_id AS requestId, a.tutor_id AS tutorId,
              t.name AS tutorName, t.img AS tutorImg, t.experience, t.fee, t.rating,
              a.coverLetter, a.cvUrl, a.certificateUrl, a.status, a.appliedDate
       FROM applications a
       LEFT JOIN tutors t ON t.id = a.tutor_id
       ORDER BY a.id`
    );
    res.json(rows.map((row) => ({
      ...row,
      fee: asNumber(row.fee),
      rating: asNumber(row.rating),
      subjects: [],
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
      `SELECT h.*, t.name AS tutorName, t.img AS tutorImg
       FROM hired_tutors h
       LEFT JOIN tutors t ON t.id = h.tutor_id
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

router.get('/withdrawal_requests', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT w.*, t.name AS tutorName, t.img AS tutorImg
       FROM withdrawal_requests w
       LEFT JOIN tutors t ON t.id = w.tutor_id
       ORDER BY w.id DESC`
    );
    res.json(rows.map((row) => ({
      ...row,
      tutorId: row.tutor_id,
      amount: asNumber(row.amount),
      requestedDate: dateOnly(row.requestedDate),
      processedDate: dateOnly(row.processedDate),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
