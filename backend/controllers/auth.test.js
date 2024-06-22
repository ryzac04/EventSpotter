"use strict";

const request = require("supertest");

const app = require("../src/app");
const User = require("../models/user");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("../utils/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Auth Controller", () => {

    /**
     * registerUser 
     */

    describe("registerUser", () => {
        test("correctly registers new user", async () => {
            const newUser = {
                username: "testname3",
                password: "Password!2",
                email: "testname3@email.com",
                isAdmin: false
            };

            const response = await request(app)
                .post("/auth/register")
                .send(newUser);

            expect(response.status).toEqual(201);
            expect(response.body).toEqual({
                "accessToken": expect.any(String),
                "refreshToken": expect.any(String)
            });
            expect(response.header.authorization).toBeTruthy();
            expect(response.header["x-refresh-token"]).toBeTruthy();
        });

        test("throws BadRequestError for duplicate user", async () => {
            const duplicateUser = {
                username: "testname1",
                password: "Password!2",
                email: "testname1@email.com",
                isAdmin: false
            };

            const response = await request(app)
                .post("/auth/register")
                .send(duplicateUser);
            
            expect(response.status).toEqual(400);
            expect(response.body.error.message).toBe("Username testname1 is already taken.");
        });

        test("throws BadRequestError for missing data", async () => {
            const incompleteUser = {
                email: "testname3@email.com",
                isAdmin: false
            };

            const response = await request(app)
                .post("/auth/register")
                .send(incompleteUser);
                        
            expect(response.status).toEqual(400);
            expect(response.body.error.message).toBe("Username is required for registration. Password is required for registration.");
        });

        test("throws InternalServerError for unexpected error during registration", async () => {
            jest.spyOn(User, "register").mockImplementationOnce(() => {
                throw new Error();
            });
            const newUser = {
                username: "testname3",
                password: "Password!2",
                email: "testname3@email.com",
                isAdmin: false
            };

            const response = await request(app)
                .post("/auth/register")
                .send(newUser);
            
            expect(response.status).toEqual(500);
            expect(response.body.error.message).toBe("Internal Server Error")
        });
    });

    /**
     * authenticateUser
     */

    describe("authenticateUser", () => {
        test("correctly authenticates user", async () => {
            const user = {
                username: "testname1",
                password: "Password!2"
            };

            const response = await request(app)
                .post("/auth/login")
                .send(user);
                            
            expect(response.status).toEqual(200);
            expect(response.body).toEqual({
                "accessToken": expect.any(String),
                "refreshToken": expect.any(String),
            });
            expect(response.header.authorization).toBeTruthy();
            expect(response.header["x-refresh-token"]).toBeTruthy();
        });

        test("throws UnauthorizedError if user not found", async () => {
            const user = {
                username: "testname3",
                password: "Password!2"
            };

            const response = await request(app)
                .post("/auth/login")
                .send(user);
            
            expect(response.status).toEqual(401);
            expect(response.body.error.message).toBe("User not found.");
        });

        test("throws BadRequestError for missing data", async () => {
            const incompleteUser = {};

            const response = await request(app)
                .post("/auth/login")
                .send(incompleteUser);
                        
            expect(response.status).toEqual(400);
            expect(response.body.error.message).toBe("Username is required for authentication. Password is required for authentication.");
        });

        test("throws InternalServerError for unexpected error during authentication", async () => {
            jest.spyOn(User, "authenticate").mockImplementationOnce(() => {
                throw new Error();
            });
            const newUser = {
                username: "testname1",
                password: "Password!2"
            };

            const response = await request(app)
                .post("/auth/login")
                .send(newUser);
            
            expect(response.status).toEqual(500);
            expect(response.body.error.message).toBe("Internal Server Error")
        });
    });

    /**
     * refreshToken
     */

    describe("refreshToken", () => {
        let tokens;

        test("correctly refreshes access JWT", async () => {
            const user = {
                username: "testname1",
                password: "Password!2"
            };

            const res = await request(app)
                .post("/auth/login")
                .send(user);             
            
            tokens = {
                accessToken: res.header["Authorization"],
                refreshToken: res.header["x-refresh-token"],
            };

            const response = await request(app)
                .post("/auth/refresh")
                .send({ refreshToken: tokens.refreshToken });
                        
            expect(response.status).toEqual(200);
            expect(response.body.accessToken).toBeTruthy(); 
            expect(response.header.authorization).toBeTruthy();
        });

        test("throws BadRequestError for invalid refresh token", async () => {
            const invalidRefreshResponse = await request(app)
                .post("/auth/refresh")
                .send({ refreshToken: "invalid_refresh_token" });

            expect(invalidRefreshResponse.status).toEqual(400);
            expect(invalidRefreshResponse.body.error.message).toBe("Failed to verify JWT.");
        });
    });


    /**
     * logoutUser
     */

    describe("logoutUser", () => {
        test("should logout user successfully", async () => {
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({
                    username: "testname1",
                    password: "Password!2"
                });

            const refreshToken = loginResponse.header["x-refresh-token"];

            const logoutResponse = await request(app)
                .post("/auth/logout")
                .set("x-refresh-token", refreshToken);

            expect(logoutResponse.status).toEqual(200);
            expect(logoutResponse.body.success).toBeTruthy();
            expect(logoutResponse.body.message).toBe("User logged out successfully");
        });

        test("should logout user with no refresh token", async () => {
            const response = await request(app)
                .post("/auth/logout");

            expect(response.status).toEqual(200);
        });

        test("should logout user with invalid refresh token", async () => {
            const response = await request(app)
                .post("/auth/logout")
                .set("x-refresh-token", "invalid_refresh_token");

            expect(response.status).toEqual(200);
        });

        test("should handle internal server error", async () => {
            jest.spyOn(User, "deleteRefreshToken").mockRejectedValueOnce(new Error("Internal Server Error"));

            const loginResponse = await request(app)
                .post("/auth/login")
                .send({
                    username: "testname1",
                    password: "Password!2"
                });

            const refreshToken = loginResponse.header["x-refresh-token"];

            const response = await request(app)
                .post("/auth/logout")
                .set("x-refresh-token", refreshToken);

            expect(response.status).toEqual(500);
            expect(response.body.error.message).toBe("Internal Server Error");
        });
    });
});