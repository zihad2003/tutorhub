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
app.use('/api/data', require('./api'));

app.get('/', (req, res) => {
  res.send('TutorHub Backend API');
});

ensureAccountColumns()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Could not prepare account tables:', error.message);
    process.exit(1);
  });
