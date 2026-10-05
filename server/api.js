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

// Example endpoint to get lessons
router.get('/lessons', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM lessons');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example endpoint to get requests
router.get('/requests', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM requests');
    res.json(rows);
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

// Generic getter factory for other tables
const addGetRoute = (tableName) => {
  router.get(`/${tableName}`, async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

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

['payments', 'hired_tutors', 'tutor_earnings', 'chats', 'withdrawal_requests'].forEach(addGetRoute);

module.exports = router;
