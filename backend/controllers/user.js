"use strict";

const User = require("../models/user");

/** User Controller Functions. */

async function findAllUsers(req, res, next) {
    try {
        const users = await User.findAllUsers();
        return res.status(200).json({ users }); 
    } catch (error) {
        next(error);
    };
};

async function findUser(req, res, next) {
    try {
        const { username } = req.params;
        const user = await User.findUser(username);
        return res.status(200).json({ user });
    } catch (error) {
        next(error);
    };
};

async function updateUser(req, res, next) {
    try {
        const user = await User.updateUser(req.params.username, req.body);
        return res.status(200).json({ user });
    } catch (error) {
        next(error);
    };
};

async function deleteUser(req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.status(200).json({ message: `User ${req.params.username} deleted successfully.` });
    } catch (error) {
        next(error);
    };
};

module.exports = { findAllUsers, findUser, updateUser, deleteUser };