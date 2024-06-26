"use strict";

require("dotenv").config();
const { REFRESH_JWT_SECRET } = process.env;

const User = require("../models/user");
const {createAccessToken, createRefreshToken, verifyToken} = require("../utils/jwt");

/** Auth Controller Functions. */

async function registerUser(req, res, next) {
    try {
        const { username, password, email, isAdmin = false } = req.body;
        const user = await User.register({ username, password, email, isAdmin });

        // Set user to res.locals.user for authorization later
        res.locals.user = user;

        // Create tokens
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        // Store refresh token in database
        await User.storeRefreshToken(user.id, refreshToken);

        // Set tokens in the response header
        res.header("Authorization", accessToken).header("x-refresh-token", refreshToken);
        
        // Return tokens in the response body
        return res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        next(error); 
    };
};

async function authenticateUser(req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);

        // Set user to res.locals.user for authorization later
        res.locals.user = user;

        // Create tokens 
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);
        
        // Store refresh token in database
        await User.storeRefreshToken(user.id, refreshToken);

        // Set tokens in the response header
        res.header("Authorization", accessToken).header("x-refresh-token", refreshToken);

        // Return tokens in the response body
        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    };
};

async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        const payload = verifyToken(refreshToken, REFRESH_JWT_SECRET);
        const user = await User.findUser(payload.username);

        const newAccessToken = createAccessToken(user);

        // Set new access token in the response header
        res.header("Authorization", newAccessToken);

        return res.status(200).json({ newAccessToken });
    } catch (error) {
        next(error);
    };
};

async function logoutUser(req, res, next) {
    try {
        const refreshToken = req.headers["x-refresh-token"];
        
        await User.deleteRefreshToken(refreshToken);

        return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        next(error);
    };
};

module.exports = {
    registerUser,
    authenticateUser,
    refreshToken,
    logoutUser
};