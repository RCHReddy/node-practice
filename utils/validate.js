const validator = require('validator');

const validateEmail = (email) => {
    return validator.isEmail(email);
};

const validateStrongPassword = (password) => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    });
};

const validatePayload = (payload) => {
    const errors = {};
    const { firstName, lastName, email, password } = payload;

    // Required fields
    if (!firstName) {
        errors.firstName = "First name is required";
    } else if (firstName.length < 4 || firstName.length > 100) {
        errors.firstName = "First name must be between 4 and 100 characters";
    }

    if (!lastName) {
        errors.lastName = "Last name is required";
    } else if (lastName.length < 4 || lastName.length > 100) {
        errors.lastName = "Last name must be between 4 and 100 characters";
    }

    if (!email) {
        errors.email = "Email is required";
    } else if (!validateEmail(email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (!validateStrongPassword(password)) {
        errors.password =
            "Password must contain 8 characters, including uppercase, lowercase, number and symbol";
    }

    return Object.keys(errors).length > 0 ? errors : null;
};
// validate profile update payload
const validateProfileUpdatePayload = (payload) => {
   const allowedFields = ["firstName", "lastName", "email", "gender", "age","about","skills","photo"];
   const isAllowed = Object.keys(payload).every((key) => allowedFields.includes(key));
   return isAllowed;
};

module.exports = { validatePayload, validateProfileUpdatePayload,validateStrongPassword };