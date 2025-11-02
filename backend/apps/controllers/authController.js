const User = require('../models/userModel');
const Role = require('../models/roleModel');
const JoinSession = require('../models/joinSessionModel');
const jwt = require('jsonwebtoken'); // Import JWT library
const bcrypt = require('bcrypt');

module.exports = {
    async join(req, res) {
        try {
            const joinSessionID = await this.createJoinSession(req.body);
            
            return res.status(201).json({ 
                message: "User was registered successfully.", 
                joinSessionID, 
                email: req.body.email
            });

        } catch (error) {
            console.log("req.body:", req.body);
            console.error("Error during user registration:", error);
            if (error.message === "Email already exists") {
                return res.status(409).json({ message: "Email already exists. Please use a different email." });
            }
            return res.status(400).json({ message: 'Registration failed. Please try again.', errors: error.message });
        }
    },

    async login(req, res) {
        try {
            // Step 1: Find the user by email
            const user = await User.findOne({ email: req.body.email }).populate('role');
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            // Step 2: Compare passwords
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            // Step 3: Generate a token
            const token = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN || 'your_jwt_secret', // Use a secure secret in production
                { expiresIn: '24h' }
            );

            // Step 4: Send a response
            return res.status(200).json({
                message: 'Login successful.',
                token,
                role: user.role.name,
            });
            
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Login failed. Please try again.', errors: error.message });
        }
    },

    // Create join Session that lives for 1 hour
    async createJoinSession(body) {
        try {
            if (await JoinSession.getEmailExists(body.email)) {
                throw new Error("Email already exists");
            }
            const newJoinSession = new JoinSession({
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
            });
            await newJoinSession.save();
            return newJoinSession._id; // Return just the ID for Stripe
        } catch (error) {
            console.error("Error creating join session:", error);
            throw error; // Let join() handle the response
        }
    },