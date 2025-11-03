const User = require('../models/userModel');
const Role = require('../models/roleModel');
const JoinSession = require('../models/joinSessionModel');
const jwt = require('jsonwebtoken'); // Import JWT library
const bcrypt = require('bcrypt');

module.exports = {
    async createJoinSession(req, res) {
        try {
            // Check if the email already exists
            if (await JoinSession.getEmailExists(req.body.email)) {
                return res.status(409).json({ message: "Email already exists. Please use a different email." });
            }

            // Prepare session data
            const sessionData = {
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobilePhone: req.body.mobilePhone,
                areaOfInterest: req.body.areaOfInterest,
                streetName: req.body.streetName,
                city: req.body.city,
                state: req.body.state,
                postcode: req.body.postcode,
            };

            // Create a new join session with a TTL of 60 minutes
            const newJoinSession = await JoinSession.createSession(sessionData, 60); // 60 minutes TTL

            // Respond with success message
            return res.status(201).json({ 
                message: "User was registered successfully.", 
                joinSessionID: newJoinSession._id, 
                email: req.body.email
            });

        } catch (error) {
            console.error("Error during user registration:", error);
            return res.status(400).json({ message: 'Registration failed. Please try again.', errors: error.message });
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
