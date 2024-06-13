"use strict";

const User = require("../models/user");

// Controller function for fetching all users.
async function findAllUsers(req, res, next) {
    try {
        const users = await User.findAllUsers();
        res.status(200).json(users);
        
    } catch (error) {
        next(error);
    };
};

//USER CONTROLLER 
// Controller function for fetching user by username.
async function findUser(req, res, next) {
    try {
        const { username } = req.params;
        const user = await User.findUser(username);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    };
};

// Controller function for updating user information. 
async function updateUser(req, res) {
    try {
        const user = await User.updateUser(req.params.username, req.body);
        res.status(200).json(user);

    } catch (error) {
        next(error);
    };
};

// Controller function for deleting a user. 
async function deleteUser(req, res) {
    try {
        await User.remove(req.params.username);
        res.status(200).json({ message: 'User deleted' });
        
    } catch (error) {
        next(error);
    };
};

module.exports = { findAllUsers, findUser, updateUser, deleteUser };