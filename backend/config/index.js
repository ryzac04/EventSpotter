"use strict";

/** Configuration for application; can be required many places. */

const { NODE_ENV } = process.env;

// use test db or dev db depending on NODE_ENV setting. 
const dbUrl = NODE_ENV === "test" ? process.env.TEST_DB_URL : process.env.DB_URL;

// Speed up argon2 during tests, since algorithm safety isn't being tested.
const argon2TimeCost = process.env.NODE_ENV === "test" ? 1 : 10;

module.exports = {
    dbUrl,
    argon2TimeCost
};