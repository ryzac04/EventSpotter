"use strict";

require("dotenv").config();

const { REFRESH_JWT_SECRET } = process.env;

const { UnauthorizedError } = require("../utils/expressError");
const { verifyToken } = require("../utils/jwt");

function validateRefreshToken(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken || req.headers["x-refresh-token"];
        if (!refreshToken) {
            throw new UnauthorizedError("No refresh token provided.");
        }

        const decodedToken = verifyToken(refreshToken, REFRESH_JWT_SECRET);

        // Attach decoded token to request object
        req.refreshTokenPayload = decodedToken;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    validateRefreshToken
};