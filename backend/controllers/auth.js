"use strict";

require("dotenv").config();

const { REFRESH_JWT_SECRET } = process.env;

const User = require("../models/user");
const {createAccessToken, createRefreshToken, verifyToken} = require("../utils/jwt");

/** Auth Controller Functions. */

async function registerUser(req, res, next) {
    try {
        const { username, password, email, isAdmin } = req.body;
        const newUser = await User.register({ username, password, email, isAdmin });

        const accessToken = createAccessToken(newUser);
        const refreshToken = createRefreshToken(newUser);

        // Set tokens in the response header
        res.header("x-access-token", accessToken).header("x-refresh-token", refreshToken);
        
        // Return registered user in the response body
        return res.status(201).json(newUser);
    } catch (error) {
        next(error); 
    };
};

async function authenticateUser(req, res, next) {
    try {
        const { username, password } = req.body;
        const authUser = await User.authenticate(username, password);

        const accessToken = createAccessToken(authUser);
        const refreshToken = createRefreshToken(authUser);

        // Set tokens in the response header
        res.header("x-access-token", accessToken).header("x-refresh-token", refreshToken);

        // Return logged in user in the response body
        return res.status(201).json(authUser);
    } catch (error) {
        next(error);
    };
};

async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        const payload = verifyToken(refreshToken, REFRESH_JWT_SECRET);
        const user = await User.findUser(payload.sub);

        const newAccessToken = createAccessToken(user);

        // Set new access token in the response header
        res.header("x-access-token", newAccessToken).json({ accessToken: newAccessToken });
    } catch (error) {
        next(error);
    };
};

module.exports = {
    registerUser,
    authenticateUser,
    refreshToken
};