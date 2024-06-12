"use strict";

/** Express app for EventSpotter. */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { NODE_ENV } = process.env; 
const { NotFoundError } = require("../utils/expressError");

const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

/** Define Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

/** Handle 404 errors. */
app.use((req, res, next) => {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use((err, req, res, next) => {
    if (NODE_ENV !== "test") console.error(err.stack);
    // default status is 500 Internal Server Error
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    // set the status and alert the user
    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;