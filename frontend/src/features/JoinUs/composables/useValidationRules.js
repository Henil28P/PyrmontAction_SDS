import { helpers, required, email, minLength, maxLength, numeric } from '@vuelidate/validators';

// Custom validators
export const validNumber = helpers.withMessage(
  'Must be exactly 10 digits, start with 04',
  (value) => /^[0-9]{10}$/.test(value) && value.startsWith('04')
);

export const stateValidator = helpers.withMessage(
  'State is required',
  (value) => value !== 'Default'
);

// Validation rules
export const getValidationRules = () => {
  return {
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Please enter a valid email address', email),
    },
    password: { required: helpers.withMessage('Password is required', required) },
    firstName: { required: helpers.withMessage('First name is required', required) },
    lastName: { required: helpers.withMessage('Last name is required', required) },
    mobilePhone: {
      validNumber: validNumber,
    },
    areaOfInterest: { required: helpers.withMessage('Area of interest is required', required) },
    streetName: { required: helpers.withMessage('Street name is required', required) },
    city: { required: helpers.withMessage('City name is required', required) },
    state: { stateValidator: stateValidator },
    postcode: {
      required: helpers.withMessage('Postcode is required', required),
      numeric: numeric,
      minLength: minLength(4),
      maxLength: maxLength(4),
    },
  };
};