const mongoose = require('mongoose');
const Role = require('./apps/user/roleModel');
require('dotenv').config();

// Ensure roles exist in the database
async function seedRoles() {
    try {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        const roles = [
            { name: 'admin' },
            { name: 'member' }
        ];

        for (const roleData of roles) {
            const existingRole = await Role.findOne({ name: roleData.name });
            if (!existingRole) {
                const role = new Role(roleData);
                await role.save();
                console.log(`Created role: ${roleData.name}`);
            } else {
                console.log(`Role already exists: ${roleData.name}`);
            }
        }

        console.log('Role seeding completed');
    } catch (error) {
        console.error('Error seeding roles:', error);
        throw error;
    }
}

// Call this function when the server starts
module.exports = { seedRoles };