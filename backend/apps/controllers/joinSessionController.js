const User = require('../models/userModel');
const Role = require('../models/roleModel');
const JoinSession = require('../models/joinSessionModel');
const jwt = require('jsonwebtoken'); // Import JWT library
const bcrypt = require('bcrypt');

module.exports = {
    async createJoinSession(body) {
        try {
            // Check if the email already exists
            if (await JoinSession.getEmailExists(body.email)) {
                return { status: 409, message: "Email already exists. Please use a different email." };
            }

            // Prepare session data
            const sessionData = {
                email: body.email,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName,
                mobilePhone: body.mobilePhone,
                areaOfInterest: body.areaOfInterest,
                streetName: body.streetName,
                city: body.city,
                state: body.state,
                postcode: body.postcode,
            };

            // Create a new join session with a TTL of 60 minutes
            const newJoinSession = await JoinSession.createSession(sessionData, 60); // 60 minutes TTL

            // Respond with success message
            return newJoinSession;

        } catch (error) {
            console.error("Error during user registration:", error);
            return { message: 'Registration failed. Please try again.', errors: error.message };
        }
    },

    async deleteJoinSession(req, res) {
        try {
            const { id } = req.params;
            await JoinSession.findByIdAndDelete(id);
            return res.status(204).send();
        } catch (error) {
            console.error("Error during session deletion:", error);
            return res.status(400).json({ message: 'Session deletion failed. Please try again.', errors: error.message });
        }
    },
};
