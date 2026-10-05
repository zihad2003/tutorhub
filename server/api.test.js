const test = require('node:test');
const assert = require('node:assert/strict');

const API = process.env.TUTORHUB_API || 'http://127.0.0.1:5001';

test('approved tutors include a subjects list and numeric ratings', async () => {
  const response = await fetch(`${API}/api/data/tutors`);
  assert.equal(response.status, 200);
  const tutors = await response.json();
  assert.ok(Array.isArray(tutors));
  assert.ok(tutors.length > 0);
  for (const tutor of tutors) {
    assert.ok(Array.isArray(tutor.subjects));
    assert.equal(typeof tutor.rating, 'number');
    assert.equal(typeof tutor.fee, 'number');
    assert.equal(tutor.password_hash, undefined);
  }
});

test('platform summary matches stored account and lesson counts', async () => {
  const response = await fetch(`${API}/api/data/summary`);
  assert.equal(response.status, 200);
  const summary = await response.json();
  assert.equal(typeof summary.tutors, 'number');
  assert.equal(typeof summary.parents, 'number');
  assert.equal(typeof summary.completedLessons, 'number');
  assert.equal(typeof summary.paidRevenue, 'number');
  assert.equal(summary.activeUsers, summary.tutors + summary.parents);
  assert.ok(summary.tutors > 0);
  assert.ok(summary.parents > 0);
});

test('applications include the tutor name from the tutors table', async () => {
  const response = await fetch(`${API}/api/data/applications`);
  assert.equal(response.status, 200);
  const applications = await response.json();
  assert.ok(Array.isArray(applications));
  assert.ok(applications.length > 0);
  assert.equal(typeof applications[0].tutorName, 'string');
  assert.ok(Array.isArray(applications[0].subjects));
});
