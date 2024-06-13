"use strict";

const express = require('express');
const router = express.Router();

const {validateUserRegistration, validateUserAuth} = require("../middleware/validators");
const { validateRefreshToken } = require("../middleware/auth");
const { registerUser, authenticateUser, refreshToken } = require("../controllers/auth");

// Auth Routes
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserAuth, authenticateUser);
router.post("/refresh", validateRefreshToken, refreshToken);

module.exports = router;