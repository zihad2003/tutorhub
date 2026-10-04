const pool = require('./db');

async function testConnection() {
  const expectedTables = [
    'tutors', 'parents', 'categories', 'tutor_subjects',
    'requests', 'applications', 'hired_tutors', 'lessons',
    'payments', 'tutor_earnings', 'withdrawal_requests',
    'chats', 'messages'
  ];

  try {
    console.log('Connecting to MySQL database...');
    const [rows] = await pool.query('SELECT 1 as result;');
    console.log('Successfully connected to the database.');
    
    console.log('\nChecking required tables:');
    const [tables] = await pool.query('SHOW TABLES;');
    const existingTables = tables.map(t => Object.values(t)[0]);

    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        console.log(`[PASS] Table '${table}' exists.`);
      } else {
        console.log(`[FAIL] Table '${table}' is missing!`);
      }
    }
  } catch (error) {
    console.error('Error connecting to the database:');
    console.error(error.message);
  } finally {
    process.exit();
  }
}

testConnection();
