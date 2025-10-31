const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Role = require('./apps/models/roleModel'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB (Mongoose)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pyrmont_sds';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        console.log('Connected to the database');
        await seedRoles();
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });


// Mount route modules under /api
app.use('/api/users', require('./apps/routes/userRoutes')); 
app.use('/api/projects', require('./apps/routes/projectRoutes'));
app.use('/api/gallery', require('./apps/routes/galleryRoutes')); 
app.use('/api/contact', require('./apps/routes/contactRoutes')); 
app.use('/api/auth', require('./apps/routes/authRoutes')); 
app.use('/api/events', require('./apps/routes/eventRoutes')); 
app.use('/api/minutes', require('./apps/routes/meetingMinuteRoutes'));
app.use('/api/blogs', require('./apps/routes/blogRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

// Seed initial roles if they don't exist

async function seedRoles() {
    const roles = ['admin', 'member', 'editor'];

    for (const roleName of roles) {
        const existingRole = await Role.findOne({ name: roleName });
        if (!existingRole) {
            await Role.create({ name: roleName });
            console.log(`Role ${roleName} created.`);
        }
    }
}


