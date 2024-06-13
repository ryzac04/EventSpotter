
require("dotenv").config();

const jwt = require("jsonwebtoken");
const { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = process.env;

const { BadRequestError } = require("./expressError");

/**
 * Function to generate an access JWT.
 * 
 * @param {Object} user - the user object containing user information. 
 * @param {integer} user.id - the unique identifier of the user. 
 * @param {string} user.username - the username of the user. 
 * @param {string} user.email - the email of the user. 
 * @param {boolean} user.isAdmin - indicates whether the user has administrative privileges. 
 * @returns {string} 'accessToken' - the generated access token. 
 * @throws {BadRequestError} if invalid properties exist for JWT. 
 */

function createAccessToken(user) {
    // Throws error with specific error message if invalid properties exist for JWT. 
    try {
        if (!user.id || !user.username || !user.email || user.isAdmin === undefined || user.isAdmin === null) {
            const invalidProperties = [];
            if (!user.id) invalidProperties.push("'sub'");
            if (!user.username) invalidProperties.push("'username'");
            if (!user.email) invalidProperties.push("'email'");
            if (user.isAdmin === undefined || user.isAdmin === null) invalidProperties.push("'isAdmin'");

            throw new BadRequestError(`User object must have valid ${invalidProperties.join(', ')} properties.`);
        };

        let payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            iat: Math.floor(Date.now() / 1000)
        };

        let accessToken = jwt.sign(payload, ACCESS_JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });

        return accessToken;
    } catch (error) {
        console.error("Error creating access token:", error);
        throw new BadRequestError("Failed to create access token.");
    }
}

/**
 * Functions to generate a refresh JWT. 
 * 
 * @param {Object} user - the user object containing user information. 
 * @param {integer} user.id - the unique identifier of the user. 
 * @returns {string} 'refreshToken' - the generated refresh token. 
 * @throws {BadRequestError} if the user object does not have a valid 'sub' property.
*/
function createRefreshToken(user) {
    try{
        if (!user.id) {
            throw new BadRequestError("User object must have valid 'sub' property.")
        };

        let payload = {
            sub: user.id,
            username: user.username,
            iat: Math.floor(Date.now() / 1000)
        };

        let refreshToken = jwt.sign(payload, REFRESH_JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

        return refreshToken;
    } catch (error) {
        console.error("Error creating refresh token:", error);
        throw new BadRequestError("Failed to create refresh token.");
    }
}

/**
 * Function to verify a token.
 * 
 * @param {string} token - the token to be verified.
 * @param {string} secret - the secret key to verify the token.
 * @returns {Object} 'verifiedToken' - the verified token.
 * @throws {BadRequestError} if verifying the JWT fails. 
 */

function verifyToken(token, secret) {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return verifiedToken;
    } catch (error) {
        console.error("Error verifying JWT:", error);
        throw new BadRequestError("Failed to verify JWT.");
    }
}

module.exports = { createAccessToken, createRefreshToken, verifyToken };