"use strict";

const { validateRefreshToken } = require("./auth");
const { createRefreshToken } = require("../utils/jwt");
const { UnauthorizedError } = require("../utils/expressError");

describe("Auth Middleware", () => {

    describe("validateRefreshToken", () => {
        
        test("validates and attaches token payload to request", () => {
            const user = {
                id: 1,
                username: "testname",
            }
            const validRefreshToken = createRefreshToken(user);

            const req = {
                body: { refreshToken: validRefreshToken },
                headers: { "x-refresh-token": validRefreshToken }
            };

            const res = {};

            const next = jest.fn();

            validateRefreshToken(req, res, next);

            expect(req.refreshTokenPayload).toBeDefined();
            expect(req.refreshTokenPayload.sub).toBe(1);
            expect(req.refreshTokenPayload.username).toBe("testname");
        });

        test("throws UnauthorizedError if no refreshToken provided", () => {
            const req = { body: {}, headers: {} };
            const res = {};
            const next = jest.fn();

            validateRefreshToken(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
        });

        test("throws Error for invalid refreshToken", () => {
            const invalidRefreshToken = "not_valid";

            const req = {
                body: {refreshToken: invalidRefreshToken},
                headers: { "x-refresh-token": invalidRefreshToken }
            };

            const res = {};

            const next = jest.fn();

            validateRefreshToken(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});

