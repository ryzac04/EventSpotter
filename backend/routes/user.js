"use strict";

const express = require('express');
const router = express.Router();

const { validateUserRegistration } = require("../middleware/validators");
const { ensureAdmin, ensureAuthenticated, ensureCorrectUserOrAdmin } = require("../middleware/user");
const { registerUser } = require("../controllers/auth");
const { findAllUsers, findUser, updateUser, deleteUser } = require("../controllers/user");

// User Routes 
router.post("/", ensureAdmin, validateUserRegistration, registerUser);
router.get("/", ensureAdmin, findAllUsers);
router.get("/:username", ensureAuthenticated, ensureCorrectUserOrAdmin, findUser);
router.patch("/:username", ensureAuthenticated, ensureCorrectUserOrAdmin, updateUser);
router.delete("/:username", ensureAuthenticated, ensureCorrectUserOrAdmin, deleteUser);

module.exports = router;