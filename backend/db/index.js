"use strict";

/** Database setup for EventSpotter. */

const { Client } = require('pg');
const { dbUrl } = require("../config/index");

const db = new Client({
    connectionString: dbUrl,
});

db.connect();

module.exports = db; 