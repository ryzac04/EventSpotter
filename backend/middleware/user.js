"use strict";

require("dotenv").config();
const { ACCESS_JWT_SECRET } = process.env;

const { UnauthorizedError } = require("../utils/expressError");
const { verifyToken } = require("../utils/jwt");

// Middleware to ensure the request has a valid access token 
function ensureAuthenticated(req, res, next) {
    try {
        const accessToken = req.body.accessToken || req.headers.authorization;
        if (!accessToken) {
            throw new UnauthorizedError("No token provided.");
        }

        // Remove "Bearer" from the token string if it's present
        const actualToken = accessToken.startsWith("Bearer ")
            ? accessToken.slice(7)
            : accessToken.startsWith("bearer ")
                ? accessToken.slice(7)
                : accessToken;

        const verifiedToken = verifyToken(actualToken, ACCESS_JWT_SECRET);

        res.locals.user = verifiedToken;

        return next();
    } catch (error) {
        return next(error);
    }
}

function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.isAdmin) {
            throw new UnauthorizedError("You are not authorized as an admin.");
        };
        return next(); 
    } catch (error) {
        return next(error);
    };
};

function ensureCorrectUserOrAdmin(req, res, next) {
    try {
        const user = res.locals.user; 
        if (!(user && (user.isAdmin || user.username === req.params.username))) {
            throw new UnauthorizedError("You are not authorized to access this resource.");
        };
        return next();
    } catch (error) {
        return next(error);
    };
};

module.exports = { ensureAuthenticated, ensureAdmin, ensureCorrectUserOrAdmin };