"use strict";

const argon = require("argon2");

const db = require("../db/index");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../utils/expressError");

const { argon2TimeCost } = require("../config/index");
const { sqlForPartialUpdate } = require("../utils/sqlPartialUpdate");
const { set } = require("../src/app");

/** User model and related functions. */

class User {

    /**
     * Register user with data. 
     * 
     * Returns { username, email, isAdmin }
     * 
     * Throws BadRequestError on duplicates. 
     */

    /**
     * Register user with data 
     * @param {*} param0 
     * @returns { username, email, isAdmin }
     */

    static async register({ username, password, email, isAdmin }) {
        // Check for duplicate username
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
    };

    /**
     * 
     * @param {*} username 
     * @param {*} password 
     * @returns 
     */

    static async authenticate(username, password) {
        // try to find the user
        const result = await db.query(
            `SELECT username,
                    password,
                    email,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username],
        );
        
        const user = result.row[0];

        // compare hashed password to a new hash from password
        if (user) {
            const isValid = await argon.verify(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            };
        };

        throw new UnauthorizedError("Invalid username/password.");
    };

    /**
     * 
     * @param {*} username 
     * @returns 
     */
    
    static async findUser(username) {
        const result = await db.query(
            `SELECT username,
                    email,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (!user) throw new NotFoundError(`Unable to find user: ${username}`);

        return user; 
    };

    /**
     * 
     * @returns 
     */

    static async findAllUsers() {
        const result = await db.query(
            `SELECT username,
                    email,
                    is_admin AS "isAdmin"
            FROM users
            ORDER BY username`,
        );

        return result.rows;
    };

    /**
     * 
     * @param {*} username 
     * @param {*} data 
     * @returns 
     */

    static async updateUser(username, data) {
        if (data.password) {
            data.password = await argon.hash(password, argon2TimeCost);
        };

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                username: "username",
                email: "email",
                isAdmin: "is_admin"
            });
        
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
                          SET ${setCols}
                          WHERE username = ${usernameVarIdx}
                          RETURNING username,
                                    email,
                                    is_admin AS "isAdmin"`;
        
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`Unable to find user: ${username}`);

        delete user.password;
        return user; 
    };

    /**
     * 
     * @param {*} username 
     */

    static async remove(username) {
        let result = await db.query(
            `DELETE
            FROM users
            WHERE username = $1
            RETURNING username`,
            [username],
        );

        const user = result.rows[0];

        if (!user) throw new NotFoundError(`Unable to find user: ${username}`);
    };
};

module.exports = User;