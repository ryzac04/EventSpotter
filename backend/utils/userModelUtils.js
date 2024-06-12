"use strict";

const argon = require("argon2");

const db = require("../db/index");
const {validatePassword} = require("../middleware/validators");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError
} = require("../utils/expressError");

const { argon2TimeCost } = require("../config/index");

// Various utility functions used in User model. 

/**
 * Check if a username is already taken. 
 * 
 * @param {string} username - the username of the user. 
 * @throws {BadRequestError} if the username is already taken. 
 */

async function checkDuplicateUsername(username) {

    const duplicateCheck = await db.query(
        `SELECT username
        FROM users
        WHERE username = $1`,
        [username],
    );
    if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Username '${username}' is already taken.`);
    }
}

/**
 * Check if user exists
 * 
 * @param {Object} user - user object.
 * @throws {NotFoundError} if user is not found. 
 */

function checkUserExists({ user }) {
    if (!user) {
        throw new NotFoundError("Unable to find user.");
    }
}

/**
 * Hash a user's password. 
 * 
 * @param {string} password - the password of the user to hash. 
 * @returns {Promise<string>} - the hashed password. 
 * @throws {InternalServerError} if there is an issue with hashing the password.
 */

async function hashPassword(password) {
    try {
        return await argon.hash(password, argon2TimeCost);
    } catch (error) {
        console.error("Error in hashPassword:", error);
        if (error instanceof BadRequestError) {
            throw error;
        } else {
            throw new InternalServerError("Failed to hash password.");
        }
    }
}

/**
 * Verifies validity of password for user authentication. 
 * 
 * @param {Object} user - user object.
 * @param {string} password - password to be verified against user.password. 
 * @throws {UnauthorizedError} if password is invalid. 
 */

async function verifyPassword({ user }, password) {
    const isValid = await argon.verify(user.password, password);
    if (!isValid) {
        throw new UnauthorizedError("Invalid password.");
    }
}

/**
 * Constructs SQL components for updating partial data in a database table.
 * 
 * @param {Object} dataToUpdate - The data to be updated. Keys represent column names, and values represent new data.
 * @param {Object} jsToSql - An optional mapping object to map JavaScript-style column names to their SQL equivalents.
 * @returns {Object} An object containing the SQL components for the update query.
 * @throws {BadRequestError} Throws an error if no data is provided for update.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError("No data");

    const cols = keys.map((colName, idx) =>
        `"${jsToSql[colName] || colName}"=$${idx + 1}`,
    );

    const setCols = cols.join(", ");
    const values = Object.values(dataToUpdate);

    return {
        setCols: setCols,
        values: values
    }
}

module.exports = {
    checkDuplicateUsername,
    checkUserExists,
    hashPassword,
    verifyPassword,
    sqlForPartialUpdate
};