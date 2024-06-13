"use strict";

const { UnauthorizedError } = require("../utils/expressError");
const { verifyToken } = require("../utils/jwt");

// Middleware to ensure the request has a valid access token 
function ensureAuthenticated(req, res, next) {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            throw new UnauthorizedError("No token provided.");
        }

        // Remove "Bearer" from the token string if it's present
        const actualToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

        const verifiedToken = verifyToken(actualToken, process.env.ACCESS_JWT_SECRET);

        res.locals.user = verifiedToken;
        next();
    } catch (error) {
        next(error);
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