// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Role = require('./apps/models/roleModel');
const paymentsController = require('./apps/controllers/paymentsController'); // Added for webhook route

const app = express();
app.use(cors());

// IMPORTANT: Stripe webhook must receive the raw body — before express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentsController.webhook);

// Now parse JSON for all other routes
app.use(express.json());

// === ROUTES ===
app.use('/api/payments', require('./apps/routes/paymentsRoutes'));
app.use('/api/users', require('./apps/routes/userRoutes'));
app.use('/api/projects', require('./apps/routes/projectRoutes'));
app.use('/api/gallery', require('./apps/routes/galleryRoutes'));
app.use('/api/contact', require('./apps/routes/contactRoutes'));
app.use('/api/auth', require('./apps/routes/authRoutes'));
app.use('/api/events', require('./apps/routes/eventRoutes'));
app.use('/api/minutes', require('./apps/routes/meetingMinuteRoutes'));

// === MONGODB CONNECTION ===
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pyrmont_sds';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('✅ Connected to the database');
    await seedRoles();
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});

// === SEED INITIAL ROLES ===
async function seedRoles() {
  const roles = ['admin', 'member', 'editor'];
  for (const roleName of roles) {
    const existingRole = await Role.findOne({ name: roleName });
    if (!existingRole) {
      await Role.create({ name: roleName });
      console.log(`Role created: ${roleName}`);
    }
  }
}
