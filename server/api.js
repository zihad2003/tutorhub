const express = require('express');
const router = express.Router();
const pool = require('./db');

// Example endpoint to get tutors
router.get('/tutors', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, location, experience, fee, rating, reviews, verified, img, bio, availability, cvUrl, status, appliedDate
       FROM tutors
       WHERE status = 'approved'`
    );
    res.json(rows);
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

['payments', 'applications', 'hired_tutors', 'tutor_earnings', 'chats', 'withdrawal_requests'].forEach(addGetRoute);

module.exports = router;
