"use strict";

const { ensureAuthenticated, ensureAdmin, ensureCorrectUserOrAdmin } = require("./user");
const { createAccessToken } = require("../utils/jwt");
const { UnauthorizedError } = require("../utils/expressError");

describe("User Middleware", () => {

    describe("ensureAuthenticated", () => {
        test("passes with valid token", () => {
            const user = {
                id: 1,
                username: "testname",
                email: "testname@email.com",
                isAdmin: false
            };
            const validAccessToken = createAccessToken(user);

            const req = {
                headers: { "Authorization": validAccessToken }
            };

            const res = {
                locals: {user}
            }

            const next = jest.fn();

            ensureAuthenticated(req, res, next);

            expect(req).toBeDefined();
            expect(res.locals).toBeDefined();
            expect(res.locals).toEqual({
                user: {
                    id: 1,
                    username: "testname",
                    email: "testname@email.com",
                    isAdmin: false,
                }
            });
        });

        test("throws UnauthorizedError if no accessToken provided", () => {
            const req = { body: {}, headers: {} };
            const res = { locals: {} };
            const next = jest.fn();

            ensureAuthenticated(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
        });

        test("throws Error for invalid refreshToken", () => {
            const invalidAccessToken = "not_valid";

            const req = {
                body: { accessToken: invalidAccessToken },
                headers: { "x-refresh-token": invalidAccessToken }
            };

            const res = {};

            const next = jest.fn();

            ensureAuthenticated(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("ensureAdmin", () => {
        test("passes with isAdmin true", () => {
            const user = {
                id: 1,
                username: "testname",
                password: "Password!2",
                email: "testname@email.com",
                isAdmin: true
            };

            const req = {}
            const res = {
                locals: {
                    user: user
                }
            }

            next = function (err) {
                expect(err).toBeFalsy();
            }

            ensureAdmin(req, res, next);
        });

        test("fails with isAdmin false", () => {
            const user = {
                id: 1,
                username: "testname",
                email: "testname@email.com",
                isAdmin: false
            };
            const req = {};
            const res = {
                locals: { user: user }
            };
            const next = jest.fn();

            ensureAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
        });

        test("fails with no user", () => {
            const req = {};
            const res = {
                locals: {}
            };
            const next = jest.fn();

            ensureAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
        });
    });

    describe("ensureCorrectUserOrAdmin", () => {
        test("passes with isAdmin true", () => {
            const user = {
                id: 1,
                username: "adminUser",
                email: "adminUser@email.com",
                isAdmin: true
            };
            const req = {
                params: { username: "someUser" }
            };
            const res = {
                locals: { user: user }
            };
            const next = jest.fn();

            ensureCorrectUserOrAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        test("passes with matching username", () => {
            const user = {
                id: 1,
                username: "testUser",
                email: "testUser@email.com",
                isAdmin: false
            };
            const req = {
                params: { username: "testUser" }
            };
            const res = {
                locals: { user: user }
            };
            const next = jest.fn();

            ensureCorrectUserOrAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        test("fails with non-matching username and non-admin", () => {
            const user = {
                id: 1,
                username: "otherUser",
                email: "otherUser@email.com",
                isAdmin: false
            };
            const req = {
                params: { username: "testUser" }
            };
            const res = {
                locals: { user: user }
            };
            const next = jest.fn();

            ensureCorrectUserOrAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
        });

        test("fails with no user", () => {
            const req = {
                params: { username: "testUser" }
            };
            const res = {
                locals: {}
            };
            const next = jest.fn();

            ensureCorrectUserOrAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
        });
    });
});