"use strict";

const {
    validateRequiredFields,
    validateUsername,
    validatePassword,
    validateEmail,
    validateIsAdmin
} = require("./userModelValidation");

const { BadRequestError } = require("../utils/expressError");

describe("validateRequiredFields", () => {
    test("does not throw error if all required fields are present", () => {
        expect(() => validateRequiredFields({ username: "user", password: "Password123", email: "user@example.com" })).not.toThrow();
    });

    test("throws error if any required field is missing", () => {
        expect(() => validateRequiredFields({ username: "user", password: "Password!23" })).toThrow(BadRequestError);
        expect(() => validateRequiredFields({ username: "user", email: "user@example.com" })).toThrow(BadRequestError);
        expect(() => validateRequiredFields({ password: "Password!23", email: "user@example.com" })).toThrow(BadRequestError);
    });
});

describe("validateUsername", () => {
    test("does not throw error if username is valid", () => {
        expect(() => validateUsername("username")).not.toThrow();
        expect(() => validateUsername("user_name_01")).not.toThrow();
    });

    test("throws error if username is too short", () => {
        expect(() => validateUsername("us")).toThrow(BadRequestError);
    });

    test("throws error if username contains invalid characters", () => {
        expect(() => validateUsername("user!")).toThrow(BadRequestError);
        expect(() => validateUsername("user name")).toThrow(BadRequestError);
    });
});

describe("validatePassword", () => {
    test("does not throw error if password is valid", () => {
        expect(() => validatePassword("Password1!")).not.toThrow();
    });

    test("throws error if password is too short", () => {
        expect(() => validatePassword("Pas1!")).toThrow(BadRequestError);
    });

    test("throws error if password does not contain all required characters", () => {
        expect(() => validatePassword("password")).toThrow(BadRequestError); // No uppercase, no digit, no special char
        expect(() => validatePassword("PASSWORD")).toThrow(BadRequestError); // No lowercase, no digit, no special char
        expect(() => validatePassword("Password")).toThrow(BadRequestError); // No digit, no special char
        expect(() => validatePassword("Password1")).toThrow(BadRequestError); // No special char
    });
});

describe("validateEmail", () => {
    test("does not throw error if email is in valid format", () => {
        expect(() => validateEmail("user@example.com")).not.toThrow();
        expect(() => validateEmail("user.name@example.co.uk")).not.toThrow();
    });

    test("throws error if email is in invalid format", () => {
        expect(() => validateEmail("userexample.com")).toThrow(BadRequestError);
        expect(() => validateEmail("user@.com")).toThrow(BadRequestError);
        expect(() => validateEmail("user@com")).toThrow(BadRequestError);
    });
});

describe("validateIsAdmin", () => {
    test("does not throw error if isAdmin is a boolean", () => {
        expect(() => validateIsAdmin(true)).not.toThrow();
        expect(() => validateIsAdmin(false)).not.toThrow();
    });
    
    test("throws error if isAdmin is not a boolean", () => {
        expect(() => validateIsAdmin("true")).toThrow(BadRequestError);
        expect(() => validateIsAdmin(1)).toThrow(BadRequestError);
        expect(() => validateIsAdmin(null)).toThrow(BadRequestError);
    });
});
