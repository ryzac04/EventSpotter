"use strict";

const { Validator } = require("jsonschema");
const { BadRequestError } = require("../utils/expressError");
const userRegisterSchema = require("../schemas/userRegister.json");
const userAuthSchema = require("../schemas/userAuth.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const validator = new Validator();

/**
 * Retrieves custom error message from the schema based on the validation error.
 * 
 * @param {Object} schema - the JSON schema object.
 * @param {Object} error - the validation error object from jsonschema.
 * @returns {string} - custom error message if defined in the schema, otherwise the default error message.
 */

const getCustomErrorMessage = (schema, error) => {
    const property = error.property.replace('instance.', '');

    // Handle required property error
    if (error.name === 'required') {
        const missingProperty = error.argument;
        if (schema.errorMessages && schema.errorMessages.required && schema.errorMessages.required[missingProperty]) {
            return schema.errorMessages.required[missingProperty];
        }
    }

    // Handle other validation errors with custom messages
    if (schema.properties[property] && schema.properties[property].errorMessage) {
        const customErrorMessage = schema.properties[property].errorMessage[error.name];
        if (customErrorMessage) {
            return customErrorMessage;
        }
    }

    // Default to the schema's error message
    return error.message;
};

/**
 * Formats validation errors into a single string.
 * 
 * @param {Array<Object>} errors - the array of validation error objects.
 * @param {Object} schema - the JSON schema object.
 * @returns {string} - formatted string of error messages.
 */

const formatValidationErrors = (errors, schema) => {
    return errors.map(error => getCustomErrorMessage(schema, error)).join(' ');
};

/**
 * Middleware function for validating request bodies against a specified JSON schema.
 * Throws a BadRequestError with a custom error message if validation fails.
 * 
 * @param {Object} schema - the JSON schema object to validate against.
 * @returns {Function} - middleware function that validates the request body.
 * @throws {BadRequestError} - error thrown if validation fails with a detailed message.
 */

const validateSchema = (schema) => {
    return (req, res, next) => {
        const validationResult = validator.validate(req.body, schema);

        if (!validationResult.valid) {
            const errorMessage = formatValidationErrors(validationResult.errors, schema);
            throw new BadRequestError(errorMessage);
        }
        
        next();
    };
};

/** Middleware functions present in routes. */
const validateUserRegistration = validateSchema(userRegisterSchema);
const validateUserAuth = validateSchema(userAuthSchema);
const validateUserUpdate = validateSchema(userUpdateSchema);

module.exports = {
    validateUserRegistration,
    validateUserAuth,
    validateUserUpdate
};