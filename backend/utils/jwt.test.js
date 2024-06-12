require("dotenv").config();

const jwt = require("jsonwebtoken");
const { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } = process.env;

const { createAccessToken, createRefreshToken, verifyToken } = require("./jwt");
const { BadRequestError } = require("./expressError");
const { verify } = require("argon2");

describe("JWT Utility Functions", () => {
    // Mock users for testing. 

    const user1 = {
        id: 1,
        username: "test_user",
        email: "test_user@email.com",
        isAdmin: false,
        iat: Math.floor(Date.now() / 1000)
    }

    const user2 = {
        id: 2,
        username: "test_user2",
        email: "test_user2@email.com",
        isAdmin: undefined,
        iat: Math.floor(Date.now() / 1000)
    }

    const invalidUser = {
        id: null,
        username: null,
        email: null,
        isAdmin: null,
        iat: Math.floor(Date.now() / 1000)
    }

    // Tests for createAccessToken: 
    test("createAccessToken should generate access token with correct payload", () => {
        const accessToken = createAccessToken(user1);
        const decodedAccessToken = jwt.verify(accessToken, ACCESS_JWT_SECRET);

        expect(decodedAccessToken).toEqual({
            sub: user1.id,
            username: user1.username,
            email: user1.email,
            isAdmin: user1.isAdmin,
            iat: expect.any(Number),
            exp: expect.any(Number)
        });
    });

    test("createAccessToken should throw BadRequestError if required properties are invalid", () => {

        expect(() => createAccessToken(invalidUser)).toThrow(BadRequestError);
    });

    test("createAccessToken should throw BadRequestError if required properties are missing", () => {
        const user = {};

        expect(() => createAccessToken(user)).toThrow(BadRequestError);
    });

    test("createAccessToken should throw BadRequestError if isAdmin property is undefined", () => {
        expect(() => createAccessToken(user2)).toThrow(BadRequestError);
    });

    test("createAccessToken should throw BadRequestError if JWT signing fails", () => {
        const originalSign = jwt.sign;
        jwt.sign = jest.fn(() => {
            throw new Error("JWT signing failed");
        });

        expect(() => createAccessToken(user1)).toThrow(BadRequestError);

        jwt.sign = originalSign;
    });

    // Tests for createRefreshToken:
    test("createRefreshToken should generate refresh token with correct payload", () => {
        const refreshToken = createRefreshToken(user1);
        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_JWT_SECRET);

        expect(decodedRefreshToken).toEqual({
            sub: user1.id,
            iat: expect.any(Number),
            exp: expect.any(Number)
        });
    });

    test("createRefreshToken should throw BadRequestError if sub property is invalid", () => {
        expect(() => createRefreshToken(invalidUser)).toThrow(BadRequestError);
    });

    test("createRefreshToken should throw BadRequestError if sub property is missing", () => {
        const user = {};

        expect(() => createRefreshToken(user)).toThrow(BadRequestError);
    });

    test("createRefreshToken should throw BadRequestError if sub property is undefined", () => {
        const user = {
            id: undefined
        }
        expect(() => createRefreshToken(user)).toThrow(BadRequestError);
    });

    test("createRefreshToken should throw BadRequestError if JWT signing fails", () => {
        const refreshSign = jwt.sign;
        jwt.sign = jest.fn(() => {
            throw new Error("JWT signing failed");
        });

        expect(() => createRefreshToken(user1)).toThrow(BadRequestError);

        jwt.sign = refreshSign;
    });

    // Tests for verifyToken:
    test("verifyToken should correctly verify a generated JWT", () => {
        const accessToken = createAccessToken(user1);
        const refreshToken = createRefreshToken(user1);

        const verifiedAccessToken = verifyToken(accessToken, ACCESS_JWT_SECRET);
        const verifiedRefreshToken = verifyToken(refreshToken, REFRESH_JWT_SECRET);

        expect(verifiedAccessToken).toEqual({
            sub: user1.id,
            username: user1.username,
            email: user1.email,
            isAdmin: user1.isAdmin,
            iat: expect.any(Number),
            exp: expect.any(Number)
        });

        expect(verifiedRefreshToken).toEqual({
            sub: user1.id,
            iat: expect.any(Number),
            exp: expect.any(Number)
        });
    });

    test("verifyToken should throw BadRequestError if JWT verification fails", () => {
        const invalidToken = "invalid.token.here";

        expect(() => verifyToken(invalidToken, ACCESS_JWT_SECRET)).toThrow(BadRequestError);

        const validTokenWrongSecret = createAccessToken(user1);
        const wrongSecret = 'wrong_secret';

        expect(() => verifyToken(validTokenWrongSecret, wrongSecret)).toThrow(BadRequestError);
    });
});
