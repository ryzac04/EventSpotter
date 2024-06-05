"use strict";

const argon = require("argon2");

const db = require("../db/index");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError
} = require("../utils/expressError");

const { argon2TimeCost } = require("../config/index");
const { sqlForPartialUpdate } = require("../utils/sqlPartialUpdate");

/** User model and related functions. */

class User {

    /**
     * Register a new user.
     * 
     * @param {string} username - the username of the user.
     * @param {string} password - the password of the user.
     * @param {string} email - the email of the user.
     * @param {boolean} isAdmin - admin status of the user - defaults to false.
     * @returns {Promise<Object>} 'user' - the registered user object containing properties: username, email, isAdmin. Password is deleted for security before user object returned. 
     * @throws {BadRequestError} if the username is already in use by another user.
     * @throws {InternalServerError} if there is an issue registering the user to the database not related to username duplication. 
     */

    static async register({ username, password, email, isAdmin }) {
        try {
            // Query the database for duplicate username
            const duplicateCheck = await db.query(
                `SELECT username
                FROM users
                WHERE username = $1`,
                [username],
            );

            if (duplicateCheck.rows[0]) {
                throw new BadRequestError(`Username '${username}' is already taken.`);
            };

            // Hash the password
            const hashedPassword = await argon.hash(password, argon2TimeCost);

            // Insert user into the database
            const result = await db.query(
                `INSERT INTO users
                (username,
                password,
                email,
                is_admin)
                VALUES ($1, $2, $3, $4)
                RETURNING username, email, is_admin AS "isAdmin"`,
                [
                    username,
                    hashedPassword,
                    email,
                    isAdmin
                ],
            );

            // Extract and return user data after successful registration
            const user = result.rows[0];
            delete user.password; // Remove password from the returned data

            return user;
            
        } catch (error) {
            console.error("Error registering new user to the database:", error);
            if (!(error instanceof BadRequestError)) {
                throw new InternalServerError("Failed to register new user to the database.");
            }
        };
    };

    /**
     * Authenticate a user with username and password. 
     * 
     * @param {string} username - the username of the user.
     * @param {string} password - the password of the user. 
     * @returns {Promise<Object>} 'user' - the authenticated user object containing property: username. Password is deleted for security before user object returned. 
     * @throws {UnauthorizedError} if the user is not found by username.
     * @throws {UnauthorizedError} if the password is not correct.
     * @throws {InternalServerError} if there is an issue authenticating the user not related to the username or password. 
     */

    static async authenticate(username, password) {
        try {

             // Query the database to find the user
            const result = await db.query(
                `SELECT username,
                        password,
                        email,
                        is_admin AS "isAdmin"
                FROM users
                WHERE username = $1`,
                [username],
            );
        
            const user = result.rows[0];

            // Check if user exists
            if (!user) {
                throw new UnauthorizedError("User not found.");
            };

            // Verify password
            const isValid = await argon.verify(password, user.password);
            if (!isValid) {
                throw new UnauthorizedError("Invalid password.");
            };

            // Remove password from the returned data
            delete user.password;

            return user; 
            
        } catch (error) {
            console.error("Error authenticating this user:", error);
            if (!(error instanceof UnauthorizedError)) {
                throw new InternalServerError("Failed to authenticate user.");  
            };
        };
    };

    /**
     * Find a single user by username. 
     * 
     * @param {string} username - the username of the user. 
     * @returns {Promise<Object>} 'user' - the found user object containing properties: username, email, isAdmin.
     * @throws {NotFoundError} if unable to find the queried username. 
     * @throws {InternalServerError} if there is an issue retrieving a user from the database not related to finding the queried username. 
     */
    
    static async findUser(username) {
        try {
            const result = await db.query(
                `SELECT username,
                        email,
                        is_admin AS "isAdmin"
                FROM users
                WHERE username = $1`,
                [username],
            );

            const user = result.rows[0];

            // Check if user exists
            if (!user) throw new NotFoundError(`Unable to find user: ${username}`);

            return user;

        } catch (error) {
            console.error(`Error retrieving user data for username '${username}' from the database:`, error);
            if (!(error instanceof NotFoundError)) {
                throw new InternalServerError(`Failed to retrieve user data for username '${username}' from the database.`);
            };
        };
    };

    /**
     * Find all users. 
     * 
     * @returns {Promise<Object>} 'result.rows' - all found user objects containing properties: username, email, isAdmin.  
     * @throws {InternalServerError} if there is an issue retrieving all users from the database. 
     */

    static async findAllUsers() {
        try {
            const result = await db.query(
                `SELECT username,
                        email,
                        is_admin AS "isAdmin"
                FROM users  
                ORDER BY username`,
            );

            return result.rows;

        } catch (error) {
            console.error("Error retrieving all users from the database:", error);
            throw new InternalServerError("Failed to retrieve all users from the database.");
        };
    };

    /**
     * Update user data.
     * 
     * @param {string} username - the username of the user.
     * @param {object} data - data object containing the fields to be updated, such as username, email, isAdmin. 
     * @returns {Promise<Object>} 'user' - the updated user object containing properties: username, email, isAdmin. Password is deleted for security before user object returned. 
     * @throws {NotFoundError} if unable to find the queried username. 
     * @throws {InternalServerError} if there is an issue updating the user not related to finding the queried username. 
     */

    static async updateUser(username, data) {
        try {
            // Hash the password if included in the data 
            if (data.password) {
            data.password = await argon.hash(data.password, argon2TimeCost);
            };
            
            // Generate SQL for partial update
            const { setCols, values } = sqlForPartialUpdate(
                data,
                {
                    username: "username",
                    email: "email",
                    isAdmin: "is_admin"
                });
        
            // Add the username value to the end of the values array
            const usernameVarIdx = "$" + (values.length + 1);
            
            // Construct the SQL query
            const querySql = `UPDATE users
                              SET ${setCols}
                              WHERE username = ${usernameVarIdx}
                              RETURNING username,
                                        email,
                                        is_admin AS "isAdmin"`;
        
            // Execute the query 
            const result = await db.query(querySql, [...values, username]);
            const user = result.rows[0];
            
            // Check if user exists
            if (!user) throw new NotFoundError(`Unable to find user: ${username}`);
            
            // Remove password from the returned data 
            delete user.password;
            return user;
            
        } catch (error) {
            console.error("Error updating user data to the database:", error);
            if (!(error instanceof NotFoundError)) {
                throw new InternalServerError(`Failed to update user data for username: '${username}' to the database.`);
            };
        };
    };

    /**
     * Delete a user from the database.
     * 
     * @param {string} username - the username of the user. 
     * @returns {undefined}
     * @throws {NotFoundError} if unable to find the queried username.
     * @throws {InternalServerError} if there is an issue deleting the user from the database not related to finding the queried username. 
     */

    static async remove(username) {
        try {
            let result = await db.query(
                `DELETE
                 FROM users
                 WHERE username = $1
                 RETURNING username`,
                [username],
            );

            const user = result.rows[0];

            // Check if user exists
            if (!user) throw new NotFoundError(`Unable to find user:'${username}'.`);
            
        } catch (error) {
            console.error("Error deleting user from the database:", error);
            if (!(error instanceof NotFoundError)) {
                throw new InternalServerError(`Failed to delete user '${username}' from the database.`);
            }
        };
    };
};

module.exports = User;