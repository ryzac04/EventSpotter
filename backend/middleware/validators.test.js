"use strict";

const {
    validateRegistrationFields,
    validateLoginFields,
    validateUsername,
    validatePassword,
    validateEmail,
    validateIsAdmin
} = require("./validators");

const { BadRequestError } = require("../utils/expressError");

describe("Validators", () => {
    describe("validateRegistrationFields", () => {
        test("should pass if all required fields are present", () => {
            const req = { body: { username: "user", password: "Password!2", email: "user@example.com" } };
            const next = jest.fn();
            expect(() => validateRegistrationFields(req, {}, next)).not.toThrow();
            expect(next).toHaveBeenCalled();
        });

        test("throws error if username is missing", () => {
            const req = { body: { password: "Password!2", email: "user@example.com" } };
            const next = jest.fn();
            try {
                validateRegistrationFields(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("User data missing for registration: username.")
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if password is missing", () => {
            const req = { body: { username: "user", email: "user@example.com" } };
            const next = jest.fn();
            try {
                validateRegistrationFields(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("User data missing for registration: password.")
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if email is missing", () => {
            const req = { body: { username: "user", password: "Password!2" } };
            const next = jest.fn();
            try {
                validateRegistrationFields(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("User data missing for registration: email.")
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if all required fields are missing", () => {
            const req = { body: { username: "", password: "", email: "" } };
            const next = jest.fn();
            try {
                validateRegistrationFields(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("User data missing for registration: username, password, email.")
                expect(next).not.toHaveBeenCalled();
            }
        });
    });

    describe("validateLoginFields", () => {
        test("should pass if all required fields are present", () => {
            const req = { body: { username: "user", password: "Password!2" } };
            const next = jest.fn();
            expect(() => validateLoginFields(req, {}, next)).not.toThrow();
            expect(next).toHaveBeenCalled();
        });

        test("throws error if username is missing", () => {
            const req = { body: { password: "Password!2" } };
            const next = jest.fn();
            try {
                validateLoginFields(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("User data missing for login: username.")
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if password is missing", () => {
            const req = { body: { username: "user" } };
            const next = jest.fn();
            try {
                validateLoginFields(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("User data missing for login: password.")
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if both required fields are missing", () => {
            const req = { body: { username: "", password: "" } };
            const next = jest.fn();
            try {
                validateLoginFields(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("User data missing for login: username, password.")
                expect(next).not.toHaveBeenCalled();
            }
        });
    });

    describe("validateUsername", () => {
        test("should pass if username is valid", () => {
            const req = { body: { username: "valid_username" } };
            const next = jest.fn();
            expect(() => validateUsername(req, {}, next)).not.toThrow();
            expect(next).toHaveBeenCalled();
        });

        test("throws error if username is too short", () => {
            const req = { body: { username: "a" } };
            const next = jest.fn();
            try {
                validateUsername(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Username must be at least 3 characters long.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if username contains invalid characters", () => {
            const req = { body: { username: "invalid&!usern@me" } };
            const next = jest.fn();
            try {
                validateUsername(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Username can only contain alphanumeric characters and underscores. Invalid characters found: &, !, @");
                expect(next).not.toHaveBeenCalled();
            }
        });
    });

    describe("validatePassword", () => {
        test("does not throw error if password is valid", () => {
            const req = { body: { password: "Password!2" } };
            const next = jest.fn();
            expect(() => validatePassword(req, {}, next)).not.toThrow();
            expect(next).toHaveBeenCalled();
        });

        test("throws error if password is too short", () => {
            const req = { body: { password: "Pas!2" } };
            const next = jest.fn();
            try {
                validatePassword(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password must be at least 6 characters long.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if password does not contain following: uppercase, digit, special character", () => {
            const req = { body: { password: "password" } };
            const next = jest.fn();
            try {
                validatePassword(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password must include at least one uppercase letter, digit, special character.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if password does not contain following: lowercase, digit, special character", () => {
            const req = { body: { password: "PASSWORD" } };
            const next = jest.fn();
            try {
                validatePassword(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password must include at least one lowercase letter, digit, special character.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if password does not contain following: digit, special character", () => {
            const req = { body: { password: "Password" } };
            const next = jest.fn();
            try {
                validatePassword(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password must include at least one digit, special character.");
                expect(next).not.toHaveBeenCalled();
            }
        });

        test("throws error if password does not contain following: special character", () => {
            const req = { body: { password: "Password1" } };
            const next = jest.fn();
            try {
                validatePassword(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Password must include at least one special character.");
                expect(next).not.toHaveBeenCalled();
            }
        });
    });

    describe("validateEmail", () => {
        test("should pass if email format is valid", () => {
            const req = { body: { email: "test@example.com" } };
            const next = jest.fn();
            expect(() => validateEmail(req, {}, next)).not.toThrow();
            expect(next).toHaveBeenCalled();
        });

        test("throws error if email format is not valid", () => {
            const req = { body: { email: "test!example.com" } };
            const next = jest.fn();
            try {
                validateEmail(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Invalid email format.");
                expect(next).not.toHaveBeenCalled();
            }
        });
    });

    describe("validateIsAdmin", () => {
        test("should pass if isAdmin is a boolean", () => {
            const req = { body: { isAdmin: true } };
            const next = jest.fn();
            expect(() => validateIsAdmin(req, {}, next)).not.toThrow();
            expect(next).toHaveBeenCalled();
        })

        test("throws error if isAdmin is not a boolean", () => {
            const req = { body: { isAdmin: "not_a_boolean" } };
            const next = jest.fn();
            try {
                validateIsAdmin(req, {}, next);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toBe("Invalid value for isAdmin. Must be boolean true or false.");
                expect(next).not.toHaveBeenCalled();
            }
        });
    });
});