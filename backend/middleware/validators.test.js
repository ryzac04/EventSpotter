"use strict";

const { BadRequestError } = require("../utils/expressError");
const { validateUserRegistration } = require("./validators");
const { validateUserAuth } = require("./validators");

describe("User Registration Validation Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {};
        next = jest.fn();
    });
    
    afterEach(() => {
        req = {};
        res = {};
        next.mockReset();
    });

    test("Valid user registration passes validation", () => {
        req.body = {
            username: "user",
            password: "Password!2",
            email: "user@example.com"
        }
        expect(() => validateUserRegistration(req, res, next)).not.toThrow();
        expect(next).toHaveBeenCalled();
    });

    describe("Validate that required fields are present for registration", () => {
        test("throws BadRequestError if username is missing", () => {
            req.body = {
                password: "Password!2",
                email: "user@example.com"
            };
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Username is required for registration.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws BadRequestError if password is missing", () => {
            req.body = {
                username: "user",
                email: "user@example.com"
            };
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password is required for registration.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws BadRequestError if email is missing", () => {
            req.body = {
                username: "user",
                password: "Password!2"
            };
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Email is required for registration.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws BadRequestError if multiple fields missing", () => {
            req.body = {};
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Username is required for registration. Password is required for registration. Email is required for registration.");
                expect(next).not.toHaveBeenCalled();
            }
        });
    });

    describe("Validate that username field has proper format", () => {
        test("throws BadRequestError if username is too short", () => {
            req.body = {
                username: "us",
                password: "Password!2",
                email: "user@example.com"
            }
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Username must be at least 3 characters long.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws BadRequestError if username is too long", () => {
            req.body = {
                username: "u".repeat(51),
                password: "Password!2",
                email: "user@example.com"
            }
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Username cannot exceed 50 characters.");
                expect(next).not.toHaveBeenCalled();
            }
        });
        
        test("throws BadRequestError if username contains invalid characters", () => {
            req.body = {
                username: "user@name",
                password: "Password!2",
                email: "user@example.com"
            };
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Username can only contain alphanumeric characters and underscores.");
                expect(next).not.toHaveBeenCalled();
            }
        });
    });

    describe("Validate that password field has proper format", () => {
        test("throws BadRequestError if password is too short", () => {
            req.body = {
                username: "user",
                password: "Pwd!2",
                email: "user@example.com"
            }
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password must be at least 6 characters long.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws BadRequestError if password is too long", () => {
            req.body = {
                username: "user",
                password: "Password!2".repeat(6),
                email: "user@example.com"
            }
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password cannot exceed 50 characters.");
                expect(next).not.toHaveBeenCalled();
            }
        });
        
        test("throws BadRequestError if password does not contains required special characters", () => {
            req.body = {
                username: "user",
                password: "Password2",
                email: "user@example.com"
            };
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.");
                expect(next).not.toHaveBeenCalled();
            }
        });
    });

    describe("Validate that email field has proper format", () => {
        test("throws BadRequestError if email is too long", () => {
            req.body = {
                username: "user",
                password: "Password!2",
                email: "u".repeat(100) + "@example.com"
            }
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Email cannot exceed 100 characters.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws BadRequestError if email format is invalid", () => {
            req.body = {
                username: "user",
                password: "Password!2",
                email: "user!example.com"
            }
            try {
                validateUserRegistration(req, res, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Invalid email format.");
                expect(next).not.toHaveBeenCalled();
            }
        });
    });
});

describe("User Authentication Validation Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {};
        next = jest.fn();
    });
    
    afterEach(() => {
        req = {};
        res = {};
        next.mockReset();
    });

    test("Valid user authentication passes validation", () => {
        req.body = {
            username: "user",
            password: "Password!2"
        }
        expect(() => validateUserAuth(req, res, next)).not.toThrow();
        expect(next).toHaveBeenCalled();
    });

    test("throws BadRequestError if username is missing", () => {
        req.body = { password: "Password!2" };
        try {
            validateUserAuth(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toBe("Username is required for authentication.");
            expect(next).not.toHaveBeenCalled();
        }
    });

    test("throws BadRequestError if password is missing", () => {
        req.body = { username: "user" };
        try {
            validateUserAuth(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toBe("Password is required for authentication.");
            expect(next).not.toHaveBeenCalled();
        }
    });
});