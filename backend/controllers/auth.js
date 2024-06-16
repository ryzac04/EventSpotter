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

        // Set newUser to res.locals.user for authorization later
        res.locals.user = newUser;

        const accessToken = createAccessToken(newUser);
        const refreshToken = createRefreshToken(newUser);

        // Set tokens in the response header
        res.header("Authorization", accessToken).header("x-refresh-token", refreshToken);
        
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

        // Set authUser to res.locals.user for authorization later
        res.locals.user = authUser;

        const accessToken = createAccessToken(authUser);
        const refreshToken = createRefreshToken(authUser);

        // Set tokens in the response header
        res.header("Authorization", accessToken).header("x-refresh-token", refreshToken);

        // Return logged in user in the response body
        return res.status(200).json(authUser);
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
        res.header("Authorization", newAccessToken).json({ accessToken: newAccessToken });
    } catch (error) {
        next(error);
    };
};

module.exports = {
    registerUser,
    authenticateUser,
    refreshToken
};