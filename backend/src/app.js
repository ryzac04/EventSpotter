"use strict";

/** Express app for EventSpotter. */

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

console.log(process.env.PORT);
console.log(process.env.DATABASE_URL);
console.log(process.env.NODE_ENV);

module.exports = app;