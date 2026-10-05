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

test('lessons and payments are numeric records the dashboards can render', async () => {
  const [lessonResponse, paymentResponse, requestResponse] = await Promise.all([
    fetch(`${API}/api/data/lessons`),
    fetch(`${API}/api/data/payments`),
    fetch(`${API}/api/data/requests`),
  ]);
  assert.equal(lessonResponse.status, 200);
  assert.equal(paymentResponse.status, 200);
  assert.equal(requestResponse.status, 200);
  const lessons = await lessonResponse.json();
  const payments = await paymentResponse.json();
  const requests = await requestResponse.json();
  assert.ok(lessons.length > 0);
  assert.equal(typeof lessons[0].tutorName, 'string');
  assert.equal(typeof lessons[0].fee, 'number');
  assert.match(lessons[0].date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(typeof payments[0].totalAmount, 'number');
  assert.ok(requests.some((request) => request.status === 'open'));
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
