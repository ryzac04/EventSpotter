"use strict";

const db = require("../db/index");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError
} = require("../utils/expressError");

const {
    checkDuplicateUsername,
    checkUserExists,
    hashPassword,
    verifyPassword,
    sqlForPartialUpdate,
    checkDuplicateEmail
} = require("../utils/userModelUtils");

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
     * @throws {BadRequestError} checkDuplicateUsername - error will be thrown if username is already in use. 
     * @throws {InternalServerError} if password hashed incorrectly or if there is any other issue registering the user to the database related to unexpected database behavior. 
     */

    static async register({ username, password, email, isAdmin }) {
        try {
            // Utility functions to check for duplicate username, email, and to hash password
            await checkDuplicateUsername(username);
            await checkDuplicateEmail(email);
            const hashedPassword = await hashPassword(password);

            // Insert user into the database
            const result = await db.query(
                `INSERT INTO users
                (username,
                password,
                email,
                is_admin)
                VALUES ($1, $2, $3, $4)
                RETURNING id, username, email, is_admin AS "isAdmin"`,
                [
                    username,
                    hashedPassword,
                    email,
                    isAdmin
                ],
            )

            // Extract and return user data after successful registration
            const user = result.rows[0];
            delete user.password; // Remove password from the returned data

            return user;
            
        } catch (error) {
            console.error(`Error registering new user ${username} to the database:`, error);
            if (!(error instanceof BadRequestError)) {
                throw new InternalServerError(`Unable to register new user ${username}.`);
            } else {
                throw error;
            }
        }
    }

    /**
     * Authenticate a user with username and password. 
     * 
     * @param {string} username - the username of the user.
     * @param {string} password - the password of the user. 
     * @returns {Promise<Object>} 'user' - the authenticated user object containing property: username. Password is deleted for security before user object returned. 
     * @throws {UnauthorizedError} if the user is not found by username.
     * @throws {UnauthorizedError} if the password is not correct.
     * @throws {InternalServerError} if there is any other issue authenticating the user not related to the username or password. 
     */

    static async authenticate(username, password) {
        try {

            // Query the database to find the user
            const result = await db.query(
                `SELECT id,
                        username,
                        password,
                        email,
                        is_admin AS "isAdmin"
                FROM users
                WHERE username = $1`,
                [username],
            )
        
            const user = result.rows[0];

            // Check if user exists
            if (!user) {
                throw new UnauthorizedError("User not found.");
            };

            // Verify password
            await verifyPassword({ user }, password);

            // Remove password from the returned data
            delete user.password;

            return user;
            
        } catch (error) {
            console.error(`Error authenticating ${username}:`, error);
            if (!(error instanceof UnauthorizedError)) {
                throw new InternalServerError(`Unable to authenticate ${username}.`);
            } else throw error;
        }
    }

    /**
     * Find a single user by username. 
     * 
     * @param {string} username - the username of the user. 
     * @returns {Promise<Object>} 'user' - the found user object containing properties: username, email, isAdmin.
     * @throws {NotFoundError} if unable to find the queried username. 
     * @throws {InternalServerError} if there is any other issue retrieving a user from the database not related to finding the queried username. 
     */
    
    static async findUser(username) {
        try {
            const result = await db.query(
                `SELECT id,
                        username,
                        email,
                        is_admin AS "isAdmin"
                FROM users
                WHERE username = $1`,
                [username],
            )

            const user = result.rows[0];

            // Check if user exists
            checkUserExists({ user });

            return user;

        } catch (error) {
            console.error(`Error retrieving user data for username ${username} from the database:`, error);
            if (!(error instanceof NotFoundError)) {
                throw new InternalServerError(`Unable to find username ${username}.`);
            } else throw error;
        }
    }

    /**
     * Find all users. 
     * 
     * @returns {Promise<Object>} 'result.rows' - all found user objects containing properties: username, email, isAdmin.  
     * @throws {InternalServerError} if there is any other issue retrieving all users from the database. 
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
            throw new InternalServerError("Unable to retrieve a list of all users.");
        }
    }

    /**
     * Update user data.
     * 
     * @param {string} username - the username of the user.
     * @param {object} data - data object containing the fields to be updated, such as username, email, isAdmin. 
     * @returns {Promise<Object>} 'user' - the updated user object containing properties: username, email, isAdmin. Password is deleted for security before user object returned. 
     * @throws {NotFoundError} if unable to find the queried username. 
     * @throws {InternalServerError} if there is any other issue updating the user not related to finding the queried username. 
     */

    static async updateUser(username, data) {
        try {
            // Hash the password if included in the data 
            if (data.password) {
                data.password = await hashPassword(data.password);
            };
            
            // Generate SQL for partial update
            const { setCols, values } = sqlForPartialUpdate(
                data,
                {
                    username: "username",
                    password: "password",
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
            checkUserExists({ user });
            
            // Remove password from the returned data 
            delete user.password;
            return user;
            
        } catch (error) {
            console.error(`Error updating user data for username ${username} to the database:`, error);
            if (!(error instanceof BadRequestError) && !(error instanceof NotFoundError)) {
                throw new InternalServerError(`Unable to update user data for username ${username}.`);   
            } else throw error;
        }
    }

    /**
     * Delete a user from the database.
     * 
     * @param {string} username - the username of the user. 
     * @returns {undefined}
     * @throws {NotFoundError} if unable to find the queried username.
     * @throws {InternalServerError} if there is any other issue deleting the user from the database not related to finding the queried username. 
     */

    static async remove(username) {
        try {
            let result = await db.query(
                `DELETE
                 FROM users
                 WHERE username = $1
                 RETURNING username`,
                [username]
            );

            const user = result.rows[0];

            // Check if user exists
            checkUserExists({ user });
            
        } catch (error) {
            console.error(`Error deleting ${username} from the database:`, error);
            if (!(error instanceof NotFoundError)) {
                throw new InternalServerError(`Unable to delete ${username}.`);
            } else throw error;
        }
    }

    static async storeRefreshToken(userId, token) {
        try {
            const result = await db.query(
                `INSERT INTO refresh_tokens
                (user_id,
                token)
                VALUES ($1, $2)
                RETURNING id, user_id AS "userId", token `,
                [userId, token]
            )

            const storedToken = result.rows[0];
            return storedToken;
            
        } catch (error) {
            console.error("Error storing refresh token:", error);
            throw new InternalServerError("Unable to store refresh token.");
        }
    }

    static async deleteRefreshToken(token) {
        try {
            await db.query(
                `DELETE 
                FROM refresh_tokens
                WHERE token = $1`,
                [token]
            );

            return { message: "Refresh token deleted successfully." };

        } catch (error) {
            console.error("Error deleting refresh token:", error);
            throw new InternalServerError("Unable to delete refresh token.")
        }
    }
}

module.exports = User;