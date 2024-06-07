"use strict";

const { BadRequestError} = require("../utils/expressError");

/**
 * Validate that all required fields are present for user registration. 
 * 
 * @param {string} username - the username of the user.  
 * @param {string} password - the password of the user.  
 * @param {string} email - the email of the user.  
 * @throws {BadRequestError} if any required field is missing. 
 */

function validateRequiredFields({ username, password, email }) {
    const missingProperties = [];
    if (!username) missingProperties.push("username");
    if (!password) missingProperties.push("password");
    if (!email) missingProperties.push("email");

    if (missingProperties.length > 0) {
        throw new BadRequestError(`User data missing for registration: ${missingProperties.join(", ")}.`);
    }
}

/**
 * Validate that username contains at least 3 characters and only alphanumeric characters or underscores.  
 * 
 * @param {string} username - the username of the user. 
 * @throws {BadRequestError} if username is too short.
 * @throws {BadRequestError} if username contains invalid characters.
 * 
 * Example: exampleUser_01 
 */

function validateUsername(username) {
    if (username.length < 3) {
        throw new BadRequestError("Username must be at least 3 characters long.");
    }
    const invalidChars = username.match(/[^a-zA-Z0-9_]/);
    if (invalidChars) {
        throw new BadRequestError(`Username can only contain alphanumeric characters and underscores. Invalid characters found: '${[...new Set(invalidChars)].join(", ")}'.`);
    }
}

/**
 * Validate that password contains at least 6 characters and contains at least 1 of each: uppercase letter, lowercase letter, digit, special character. 
 * 
 * @param {string} password - the password of the user. 
 * @throws {BadRequestError} if password is too short.
 * @throws {BadRequestError} if password does not contain at least 1 of each specified character.
 * 
 * Example: Password!@34
 */

function validatePassword(password) {
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
}

/**
 * Validate that email adheres to correct format. 
 * 
 * @param {string} email - the email of the user. 
 * @throws {BadRequestError} if invalid email format. 
 * 
 * Example: example@email.com
 */

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        throw new BadRequestError("Invalid email format.");
    }
}

/**
 * Validate that isAdmin is a boolean value. 
 * 
 * @param {boolean} isAdmin - admin status of the user - defaults to false. 
 * @throws {BadRequestError} if isAdmin not a boolean value. 
 */

function validateIsAdmin(isAdmin) {
    if (typeof isAdmin !== 'boolean') {
        throw new BadRequestError("Invalid value for isAdmin. Must be boolean true or false.");
    }
}

module.exports = {
    validateRequiredFields,
    validateUsername,
    validatePassword,
    validateEmail,
    validateIsAdmin
};