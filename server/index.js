const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bkashRoutes = require('./bkash');
const { router: authRoutes, ensureAccountColumns } = require('./auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/bkash', bkashRoutes);
app.use('/api/auth', authRoutes);
const dataRoutes = require('./api');
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('TutorHub Backend API');
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      error: 'The file is too large. Please upload a file that is 5 MB or smaller.',
      fields: { file: 'The file is too large. Please upload a file that is 5 MB or smaller.' },
    });
  }
  console.error(err);
  return res.status(err.status || 500).json({
    error: 'The server could not complete that request. Please try again.',
  });
});

ensureAccountColumns()
  .then(() => dataRoutes.backfillHireBilling())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Could not prepare account tables:', error.message);
    process.exit(1);
  });
