"use strict";

const argon = require("argon2");

const db = require("../db/index");
const { argon2TimeCost } = require("../config/index");

const { InternalServerError } = require("../utils/expressError");

/**
 * Setup function to prepare the database and insert example data before all tests.
 * 
 * Creates the users table if it doesn't exist, deletes any existing data, and inserts test data into the users table.
 * 
 * Creates the refresh_tokens table if it doesn't exist and deletes any existing data.
 * 
 * @throws {InternalServerError} if there's a failure in setting up test data.
 */

async function commonBeforeAll() {
    try {
        // Create the users table if it does not exist
        await db.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                is_admin BOOLEAN NOT NULL DEFAULT FALSE)`
        );

        // Create refresh_tokens table if it does not exist
        await db.query(
            `CREATE TABLE IF NOT EXISTS refresh_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                token TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
        );

        // Delete any data that may be present in users table
        await db.query("DELETE FROM users;");
        await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1;");

        // Delete any data that may be present in refresh_tokens table
        await db.query("DELETE FROM refresh_tokens;");
        await db.query("ALTER SEQUENCE refresh_tokens_id_seq RESTART WITH 1;");

        // Insert test data into users table
        await db.query(
            `INSERT INTO users (
                username, 
                password, 
                email, 
                is_admin)
            VALUES 
                ('testname1', $1, 'testname1@email.com', FALSE),
                ('testname2', $2, 'testname2@email.com', TRUE)
            RETURNING
                username,
                email,
                is_admin AS "isAdmin"`,
                [
                    await argon.hash("Password!2", argon2TimeCost),
                    await argon.hash("Password!2", argon2TimeCost)
            ]); 
        
    } catch (error) {
        console.error("Error setting up test data in 'commonBeforeAll' function:", error);
        throw new InternalServerError("Failed to set up test data in 'commonBeforeAll' function.");
    }
}

/**
 * Setup function to start a transaction before each test and restart id values at 1. 
 * 
 * @throws {InternalServerError} if there is a failure in starting the transaction. 
 */

async function commonBeforeEach() {
    try {
        await db.query("BEGIN");
    } catch (error) {
        console.error("Error starting transaction in 'commonBeforeEach' function:", error);
        throw new InternalServerError("Failed to start transaction in 'commonBeforeEach' function.");
    }
}

/**
 * Teardown function to rollback the transaction after each test. 
 * 
 * @throws {InternalServerError} if there is a failure in rolling back the transaction. 
 */

async function commonAfterEach() {
    try {
        await db.query("ROLLBACK");
    } catch (error) {
        console.error("Error with rollback transaction in 'commonAfterEach' function:", error);
        throw new InternalServerError("Failed to rollback transaction in 'commonAfterEach' function.");
    }
}

/**
 * Teardown function to close the database connection after all tests. 
 * 
 * @throws {InternalServerError} if there is a failure in closing the database connection.
 */

async function commonAfterAll() {
    try {
        await db.end();
    } catch (error) { 
        console.error("Error closing database connection in 'commonAfterAll' function:", error);
        throw new InternalServerError("Failed to close database connection in 'commonAfterAll' function.");
    }
}

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
};