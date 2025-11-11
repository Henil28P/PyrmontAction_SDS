const User = require('../models/userModel');
const Joi = require('joi');
const bcrypt = require('bcrypt');

// Reusable field definitions
const fields = {
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address that contains \'@\'. For example: example@example.com',
            'any.required': 'Email is required'
        }),
    
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/)
        .messages({
            'string.empty': 'Password is required',
            'string.pattern.base': 'Your password is not strong enough. Try again - it must be at least 10 characters and must contain uppercase and lowercase characters, numbers and symbols',
            'any.required': 'Password is required'
        }),
    
    state: Joi.string()
        .valid('NSW', 'WA', 'VIC', 'NT', 'QLD', 'TAS', 'SA')
        .messages({
            'any.only': 'State is required',
            'string.empty': 'State is required',
            'any.required': 'State is required'
        }),
    
    mobilePhone: Joi.string()
        .pattern(/^04[0-9]{8}$/)
        .messages({
            'string.empty': 'Mobile Phone is required',
            'string.pattern.base': 'Please enter a valid mobile phone number that begins with the digits 0 and 4. For example: 0411 222 333',
            'any.required': 'Mobile Phone is required'
        }),
    
    postcode: Joi.string()
        .pattern(/^[0-9]{4}$/)
        .messages({
            'string.empty': 'Postcode is required',
            'string.pattern.base': 'Please enter a valid postcode containing 4 numbers. For example: 2000',
            'any.required': 'Postcode is required'
        }),
    
    firstName: Joi.string()
        .pattern(/^[A-Za-z0-9]{1,25}$/)
        .messages({
            'string.empty': 'First name is required',
            'string.pattern.base': 'First name must be alphanumeric and up to 25 characters',
            'any.required': 'First name is required'
        }),
    
    lastName: Joi.string()
        .pattern(/^[A-Za-z0-9]{1,25}$/)
        .messages({
            'string.empty': 'Last name is required',
            'string.pattern.base': 'Last name must be alphanumeric and up to 25 characters',
            'any.required': 'Last name is required'
        }),
    
    city: Joi.string()
        .pattern(/^[A-Za-z0-9]{1,25}$/)
        .messages({
            'string.empty': 'City name is required',
            'string.pattern.base': 'City name must be alphanumeric and up to 25 characters',
            'any.required': 'City name is required'
        }),
    
    areaOfInterest: Joi.string()
        .pattern(/^[A-Za-z0-9 ]{1,25}$/)
        .messages({
            'string.empty': 'Area of interest is required',
            'string.pattern.base': 'Area of interest must be alphanumeric and up to 25 characters',
            'any.required': 'Area of interest is required'
        }),
    
    streetName: Joi.string()
        .pattern(/^[A-Za-z0-9 ]{1,25}$/)
        .messages({
            'string.empty': 'Street name is required',
            'string.pattern.base': 'Street name must be alphanumeric and up to 25 characters',
            'any.required': 'Street name is required'
        }),
};

// Composed schemas for different situations
const schemas = {
    // Login: only email and password
    login: Joi.object({
        email: fields.email.required(),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
    }),
    
    // Join/Register: all fields required
    joinUs: Joi.object({
        email: fields.email.required(),
        password: fields.password.required(),
        firstName: fields.firstName.required(),
        lastName: fields.lastName.required(),
        mobilePhone: fields.mobilePhone.required(),
        areaOfInterest: fields.areaOfInterest.required(),
        streetName: fields.streetName.required(),
        city: fields.city.required(),
        state: fields.state.required(),
        postcode: fields.postcode.required(),
    }),

    // Create account by admin: email, firstName, lastName, role
    createManager: Joi.object({
        email: fields.email.required(),
        firstName: fields.firstName.required(),
        lastName: fields.lastName.required(),
        role: Joi.string().valid('admin', 'editor').required().messages({
            'any.only': 'Role must be either admin or editor',
            'string.empty': 'Role is required',
        }),
    }),
    // Update account details: email and password (optional password for updating)
    updating: Joi.object({
        email: fields.email.optional(),
        password: fields.password.optional(),
        oldPassword: Joi.string().optional().messages({
            'string.empty': 'Current password cannot be empty',
        }),
        firstName: fields.firstName.optional(),
        lastName: fields.lastName.optional(),
        mobilePhone: fields.mobilePhone.optional(),
        areaOfInterest: fields.areaOfInterest.optional(),
        streetName: fields.streetName.optional(),
        city: fields.city.optional(),
        state: fields.state.optional(),
        postcode: fields.postcode.optional(),
    }), // At least one field must be present
};

// Generic validation middleware factory
const createValidator = (schema, options = {}) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            // Validate request body against the schema
            await schema.validateAsync(req.body, { abortEarly: true });
            
            // Check for existing email if needed
            if (options.checkEmailExists && req.body.email) {
                const existingEmail = await User.getEmailExists(req.body.email);
                const userId = id ?? (req.user?._id?.toString() ?? "");
                if (existingEmail && existingEmail._id.toString() !== userId) {
                    return res.status(400).json({ 
                        message: 'This email address is already registered. Please use a different email.'
                    });
                }
            }

            if (options.checkPasswordExists && req.body.oldPassword && req.user) {
                if (!await bcrypt.compare(req.body.oldPassword, req.user.password)) {
                    return res.status(400).json({ message: 'The current password does not match.' });
                }
                if (!req.body.password) {
                    return res.status(400).json({ message: 'New password is required when current password is provided.'});
                }
                if (req.body.oldPassword === req.body.password) {
                    return res.status(400).json({ message: 'The new password must be different from the current password.' });
                }
            }
            
            next();
        } catch (error) {
            // With abortEarly: true, we only get the first error
            let errorMessage = options.errorMessage || 'Validation failed';
            
            if (error.details && error.details.length > 0) {
                errorMessage = error.details[0].message;
            }
            
            return res.status(400).json({ 
                message: errorMessage,
                error: error.message
            });
        }
    };
};

module.exports = {
    // Export schemas for potential reuse
    schemas,
    
    // Export field definitions for potential reuse
    fields,
    
    // Specific validators for different situations
    login: createValidator(schemas.login),

    joinUs: createValidator(schemas.joinUs, {
        checkEmailExists: true
    }),

    createManager: createValidator(schemas.createManager, {
        checkEmailExists: true
    }),

    updateAccount: createValidator(schemas.updating, {
        checkEmailExists: true,
        checkPasswordExists: true
    }),
    // Generic validator for custom use cases
    createValidator,
};