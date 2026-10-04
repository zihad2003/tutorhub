const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bkashRoutes = require('./bkash');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bkash', bkashRoutes);
app.use('/api/data', require('./api'));

app.get('/', (req, res) => {
  res.send('TutorHub Backend API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
