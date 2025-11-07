const { verify } = require('jsonwebtoken');
const User = require('../models/userModel');
module.exports = {

    stateRegex : function(input){
        stateRegex = new RegExp(/(NSW|WA|VIC|NT|QLD|TAS|SA)/)
        return stateRegex.test(input);
    },

    emailRegex: function(input){
        emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
        return emailRegex.test(input);
    },

    phoneNumberRegex : function(input){
        phoneNumberRegex = new RegExp(/04[0-9]{8}/gm)
        return phoneNumberRegex.test(input);
    },

    postcodeRegex : function(input){
        postcodeRegex = new RegExp(/[0-9]{4}/gm)
        return postcodeRegex.test(input);
    },

    stringedRegex : function(input){
        nameOrCityRegex = new RegExp(/^[A-Za-z0-9]{1,25}$/);
        return nameOrCityRegex.test(input);
    },

    stringedAndWhiteRegex : function(input){
        nameOrCityRegex = new RegExp(/^[A-Za-z0-9 ]{1,25}$/);
        return nameOrCityRegex.test(input);
    },

    passwordRegex:function(input){
        // checks for lower case, upper case, symbol and length greater than 11, respectively
        passwordsRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/)
        return passwordsRegex.test(input)
    },

    async inputValidatorJoinUs(req, res, next) {
        const errorMessages = {
            state: [],
            email: [],
            mobilePhone: [],
            postcode: [],
            firstName: [],
            lastName: [],
            city: [],
            password: [],
            areaOfInterest: [],
            streetName: []
        };
        let errorCount = 0;

        // Email validation
        if (!req.body.email || req.body.email.length <= 0) {
            errorMessages.email.push("Email is required");
            errorCount++;
        } else if (!module.exports.emailRegex(req.body.email)) {
            errorMessages.email.push("Please enter a valid email address that contains '@'. For example: example@example.com");
            errorCount++;
        } else {
            // Only check for existing email if the format is valid
            const emailExists = await User.getEmailExists(req.body.email);
            if (emailExists) {
                errorMessages.email.push("This email address is already registered. Please use a different email.");
                errorCount++;
            }
        }

        // State validation
        if (!module.exports.stateRegex(req.body.state)) {
            errorCount++;
            errorMessages.state.push("State is required");
        }

        // Mobile phone validation
        if (!module.exports.phoneNumberRegex(req.body.mobilePhone)) {
            if(req.body.mobilePhone.length <= 0) {
                errorMessages.mobilePhone.push("Mobile Phone is required");
            } else {
                errorMessages.mobilePhone.push("Please enter a valid mobile phone number that begins with the digits 0 and 4. For example: 0411 222 333");
            }
            errorCount++;
        }

        // Postcode validation
        if (!module.exports.postcodeRegex(req.body.postcode)) {
            if(req.body.postcode.length <= 0) {
                errorMessages.postcode.push("Postcode is required");
            } else {
                errorMessages.postcode.push("Please enter a valid postcode containing 4 numbers. For example: 2000");
            }
            errorCount++;
        }
        
        // Password validation
        if (!module.exports.passwordRegex(req.body.password)) {
            if(req.body.password.length <= 0) {
                errorMessages.password.push("Password is required");
            } else {
                errorMessages.password.push("Your password is not strong enough. Try again - it must at least 10 characters and must contain uppercase and lower case characters, numbers and symbols");
            }
            errorCount++;
        }

        // Name, city and other validations
        if (!module.exports.stringedRegex(req.body.firstName)) {
            errorCount++;
            errorMessages.firstName.push("First name is required");
        }
        if (!module.exports.stringedRegex(req.body.lastName)) {
            errorCount++;
            errorMessages.lastName.push("Last name is required");
        }
        if (!module.exports.stringedRegex(req.body.city)) {
            errorCount++;
            errorMessages.city.push("City name is required");
        }
        if (!module.exports.stringedAndWhiteRegex(req.body.areaOfInterest)) {
            errorCount++;
            errorMessages.areaOfInterest.push("Area of interest is required");
        }
        if (!module.exports.stringedAndWhiteRegex(req.body.streetName)) {
            errorCount++;
            errorMessages.streetName.push("Street name is required");
        }

        if (errorCount > 0) {
            return res.status(400).json({ message: 'Error has occurred when registering', errors: errorMessages });
        }

        next();
    },
 

    async inputValidatorLogin(req, res, next) {
        const inputErrors = [];
        
        if (!module.exports.emailRegex(req.body.email)) {
            inputErrors.push("email");
        }

        if (inputErrors.length > 0) {
            return res.status(400).json({ message: 'Error occurred during login', errors: inputErrors });
        }

        next();
    },
};