"use strict";

const { BadRequestError } = require("../utils/expressError");

/**
 * Validation Middleware
 * 
 * Common for all following functions: 
 * @param {object} req - the request object.  
 * @param {object} res - the response object.  
 * @param {function} next - the next middleware function.  
 */

/**
 * Checks that the required fields `username`, `password`, and `email` are present in the request body for registration.
 * 
 * @throws {BadRequestError} if any of these fields are missing with a message specifying which fields are not present. 
 */

function validateRegistrationFields(req, res, next) {
    const { username, password, email } = req.body;
    const missingProperties = [];
    if (!username) missingProperties.push("username");
    if (!password) missingProperties.push("password");
    if (!email) missingProperties.push("email");

    if (missingProperties.length > 0) {
        throw new BadRequestError(`User data missing for registration: ${missingProperties.join(", ")}.`);
    }
    next();
}

/**
 * Checks that the required fields `username` and `password` are present in the request body for login.
 * 
 * @throws {BadRequestError} if any of these fields are missing with a message specifying which fields are not present. 
 */

function validateLoginFields(req, res, next) {
    const { username, password } = req.body;
    const missingProperties = [];
    if (!username) missingProperties.push("username");
    if (!password) missingProperties.push("password");

    if (missingProperties.length > 0) {
        throw new BadRequestError(`User data missing for login: ${missingProperties.join(", ")}.`);
    }
    next();
}

/**
 * Checks that the `username` contains at least 3 characters and only alphanumeric characters or underscores.  
 * 
 * @throws {BadRequestError} if username is too short or contains invalid characters.
 */

function validateUsername(req, res, next) {
    const { username } = req.body;
    if (username.length < 3) {
        throw new BadRequestError("Username must be at least 3 characters long.");
    }
    const invalidChars = username.match(/[^a-zA-Z0-9_]/g);
    if (invalidChars) {
        throw new BadRequestError(`Username can only contain alphanumeric characters and underscores. Invalid characters found: ${[...new Set(invalidChars)].join(", ")}`);
    }
    next();
}

/**
 * Checks that `password` contains at least 6 characters and at least 1 of each: uppercase letter, lowercase letter, digit, special character. 
 * 
 * @throws {BadRequestError} if password is too short and/or if it does not contain at least 1 of each required character. 
 */

function validatePassword(req, res, next) {
    const { password } = req.body;
    if (password.length < 6) {
        throw new BadRequestError("Password must be at least 6 characters long.");
    }

    const errors = [];

    if (!/[A-Z]/.test(password)){
        errors.push("uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("digit");
    }
    if(!/[^A-Za-z0-9\s]/.test(password)) {
        errors.push("special character");
    }

    if (errors.length > 0) {
        throw new BadRequestError(`Password must include at least one ${errors.join(", ")}.`);
    }
    next();
}

/**
 * Checks that email adheres to correct format. 
 * 
 * @throws {BadRequestError} if invalid email format. 
 */

function validateEmail(req, res, next) {
    const { email } = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        throw new BadRequestError("Invalid email format.");
    }
    next();
}

/**
 * Checks that isAdmin is a boolean value. 
 * 
 * @throws {BadRequestError} if isAdmin not a boolean value. 
 */

function validateIsAdmin(req, res, next) {
    const { isAdmin } = req.body;
    if (typeof isAdmin !== 'boolean') {
        throw new BadRequestError("Invalid value for isAdmin. Must be boolean true or false.");
    }
    next();
}

const validateUserRegistration = [
    validateRegistrationFields,
    validateUsername,
    validatePassword,
    validateEmail,
    validateIsAdmin
];

const validateLogin = [
    validateLoginFields,
    validateUsername,
    validatePassword
];

module.exports = {
    validateRegistrationFields,
    validateLoginFields,
    validateUsername,
    validatePassword,
    validateEmail,
    validateIsAdmin,
    validateUserRegistration,
    validateLogin
};