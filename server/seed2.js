const pool = require('./db');
const { PAYMENTS, APPLICATIONS, CHATS, HIRED_TUTORS, TUTOR_EARNINGS, WITHDRAWAL_REQUESTS, REQUESTS } = require('../src/data/mockData');

async function seedData() {
  console.log('Seeding other tables...');
  try {
    for (const p of PAYMENTS) {
      await pool.query('INSERT IGNORE INTO payments (id, month, totalLessons, totalAmount, status, paidDate, dueDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [p.id, p.month, p.totalLessons, p.totalAmount, p.status, p.paidDate || null, p.dueDate || null]);
    }
    
    for (const p of APPLICATIONS) {
      await pool.query('INSERT IGNORE INTO applications (id, request_id, tutor_id, coverLetter, cvUrl, certificateUrl, status, appliedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [p.id, p.requestId, p.tutorId, p.coverLetter, p.cvUrl || null, p.certificateUrl || null, p.status, p.appliedDate || null]);
    }

    for (const c of CHATS) {
      await pool.query('INSERT IGNORE INTO chats (id, tutor_id, parent_id, lastMessage, lastMessageTime, unread) VALUES (?, ?, ?, ?, ?, ?)',
        [c.id, c.tutorId, 1, c.lastMessage, c.lastMessageTime, c.unread]); // mock parent_id = 1
    }

    console.log('Data seeded successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
  process.exit();
}

seedData();
