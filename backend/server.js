const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB (Mongoose)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pyrmont_sds';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));


// Mount route modules under /api
app.use('/api/users', require('./apps/user/userRoutes'));
app.use('/api/projects', require('./apps/projects/projectRoutes'));
app.use('/api/gallery', require('./apps/gallery/galleryRoutes'));
app.use('/api/contact', require('./apps/contact-form/contactRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});


