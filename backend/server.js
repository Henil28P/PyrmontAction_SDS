const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { seedRoles } = require('./seedRoles');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pyrmont_sds';
mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(async () => {
    console.log('Connected to MongoDB');
    await seedRoles();
    console.log('Database initialization complete');
})
.catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});

// Mount route modules
app.use('/api/users', require('./apps/user/userRoutes'));
app.use('/api/projects', require('./apps/projects/projectRoutes'));
app.use('/api/gallery', require('./apps/gallery/galleryRoutes'));
app.use('/api/contact', require('./apps/contact-form/contactRoutes'));
app.use('/api/authentication', require('./apps/authentication/authRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});


