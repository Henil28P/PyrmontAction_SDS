// ================================
// 🌐 Pyrmont Action — Backend Server
// ================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Role = require('./apps/models/roleModel');
const paymentsController = require('./apps/controllers/paymentsController'); // For Stripe webhook

// === Create Express App ===
const app = express();

// === Global Middleware ===
app.use(cors());

// --- Stripe Webhook Route ---
// ⚠️ Webhook requires raw body for signature verification — must come BEFORE express.json()
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('⚠️ STRIPE_WEBHOOK_SECRET missing from .env — Stripe webhook may not verify correctly.');
}

app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentsController.webhook
);

// --- Normal JSON Parsing for All Other Routes ---
app.use(express.json());

// === ROUTES ===
// Stripe / Payments
app.use('/api/payments', require('./apps/routes/paymentsRoutes'));

// Other backend modules
app.use('/api/users', require('./apps/routes/userRoutes'));
app.use('/api/projects', require('./apps/routes/projectRoutes'));
app.use('/api/gallery', require('./apps/routes/galleryRoutes'));
app.use('/api/contact', require('./apps/routes/contactRoutes'));
app.use('/api/auth', require('./apps/routes/authRoutes'));
app.use('/api/events', require('./apps/routes/eventRoutes'));
app.use('/api/minutes', require('./apps/routes/meetingMinuteRoutes'));

// === Health Check Route ===
app.get('/', (req, res) => {
  res.send('✅ Pyrmont Action API is running and ready!');
});

// === MongoDB Connection ===
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pyrmont_sds';

mongoose
  .connect(mongoUri, {
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

// === Role Seeder (runs once on startup) ===
async function seedRoles() {
  try {
    const roles = ['admin', 'member', 'editor'];
    for (const roleName of roles) {
      const existingRole = await Role.findOne({ name: roleName });
      if (!existingRole) {
        await Role.create({ name: roleName });
        console.log(`🌱 Role created: ${roleName}`);
      }
    }
  } catch (error) {
    console.error('⚠️ Failed to seed roles:', error);
  }
}

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});

