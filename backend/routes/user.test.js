"use strict";

const request = require("supertest");
const app = require("../src/app");

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

describe("User Routes", () => {

    /**
     * Testing / Endpoint - POST
     */

    describe("POST /users", () => {
        test("should respond with status 201 and creates a new non-admin user if requester is admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const newUser = {
                username: "testuser",
                password: "Password!2",
                email: "testuser@example.com",
                isAdmin: false
            };

            const response = await request(app)
                .post("/users")
                .set("authorization", `Bearer ${accessToken}`)
                .send(newUser);

            expect(response.status).toEqual(201);
            expect(response.body).toEqual({
                id: 3,
                username: "testuser",
                email: "testuser@example.com",
                isAdmin: false
            });
        });

        test("should respond with status 201 and creates a new admin user if requester is admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const newUser = {
                username: "testuser",
                password: "Password!2",
                email: "testuser@example.com",
                isAdmin: true
            };

            const response = await request(app)
                .post("/users")
                .set("authorization", `Bearer ${accessToken}`)
                .send(newUser);

            expect(response.status).toEqual(201);
            expect(response.body).toEqual({
                id: 4,
                username: "testuser",
                email: "testuser@example.com",
                isAdmin: true
            });
        });

        test("throws UnauthorizedError if non-admin user attempts to access route", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const newUser = {
                username: "testuser",
                password: "Password!2",
                email: "testuser@example.com",
                isAdmin: false
            };

            const response = await request(app)
                .post("/users")
                .set("authorization", `Bearer ${accessToken}`)
                .send(newUser);

            expect(response.status).toEqual(401);
        });

        test("throws BadRequestError for missing data", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const newUser = {
                password: "Password!2",
                email: "testuser@example.com",
                isAdmin: false
            };

            const response = await request(app)
                .post("/users")
                .set("authorization", `Bearer ${accessToken}`)
                .send(newUser);

            expect(response.status).toEqual(400);
        });
    });

    /**
     * Testing / Endpoint - GET
     */

    describe("GET /", () => {
        test("should respond with status 200 and return all users", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });
            
            const accessToken = loginResponse.headers["authorization"];
            
            const response = await request(app)
                .get("/users")
                .set("authorization", `Bearer ${accessToken}`);
                
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(2);
        });

        test("throws UnauthorizedError if non-admin user attempts to access route", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });
            
            const accessToken = loginResponse.headers["authorization"];
            
            const response = await request(app)
                .get("/users")
                .set("authorization", `Bearer ${accessToken}`);
                
            expect(response.status).toEqual(401);
        });
    });

    /**
     * Testing /:username Endpoint - GET
     */

    describe("GET /:username", () => {
        test("should return user details if admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const response = await request(app)
                .get("/users/testname1")
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.status).toEqual(200);
            expect(response.body).toEqual({
                id: 1,
                username: "testname1",
                email: "testname1@email.com",
                isAdmin: false
            });
        });

        test("should return user details if same user and not admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const response = await request(app)
                .get("/users/testname1")
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.status).toEqual(200);
            expect(response.body).toEqual({
                id: 1,
                username: "testname1",
                email: "testname1@email.com",
                isAdmin: false
            });
        });

        test("throws UnauthorizedError if searching for existing user while not admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const response = await request(app)
                .get("/users/testname2")
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.status).toEqual(401);
        });

        test("throws NotFoundError if user not found - admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const response = await request(app)
                .get("/users/testname3")
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.status).toEqual(404);
        });

        test("throws UnauthorizedError if user not found - not admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const response = await request(app)
                .get("/users/testname3")
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.status).toEqual(401);
        });
    });

    /**
     * Testing /:username Endpoint - PATCH
     */

    describe("PATCH /:username", () => {
        test("should respond with status 200 and update user details - admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const username = "testname1";
            const updatedUser = {
                username: "updateduser",
                email: "updateduser@example.com",
            };

            const response = await request(app)
                .patch(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`)
                .send(updatedUser);

            expect(response.status).toEqual(200);
            expect(response.body.username).toBe(updatedUser.username);
            expect(response.body.email).toBe(updatedUser.email);
        });
        
        test("should respond with status 200 and update user details - same user", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const username = "testname1";
            const updatedUser = {
                username: "updateduser",
                email: "updateduser@example.com",
            };

            const response = await request(app)
                .patch(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`)
                .send(updatedUser);

            expect(response.status).toEqual(200);
            expect(response.body.username).toBe(updatedUser.username);
            expect(response.body.email).toBe(updatedUser.email);
        });

        test("throws UnauthorizedError if not same user", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const username = "testname2";
            const updatedUser = {
                username: "updateduser",
                email: "updateduser@example.com",
            };

            const response = await request(app)
                .patch(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`)
                .send(updatedUser);

            expect(response.status).toEqual(401);
        });

        test("throws NotFoundError if no such user", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const username = "testname3";
            const updatedUser = {
                username: "updateduser",
                email: "updateduser@example.com",
            };

            const response = await request(app)
                .patch(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`)
                .send(updatedUser);

            expect(response.status).toEqual(404);
        });

        test("can change password - same user", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const username = "testname1";
            const updatedUser = {
                password: "DifferentPW!2",
            };

            const response = await request(app)
                .patch(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`)
                .send(updatedUser);

            expect(response.status).toEqual(200);
        });

        test("admin user can change other user's password ", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];

            const username = "testname1";
            const updatedUser = {
                password: "DifferentPW!2",
            };

            const response = await request(app)
                .patch(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`)
                .send(updatedUser);

            expect(response.status).toEqual(200);
        });
    });

    /**
     * Testing /:username Endpoint - DELETE
     */

    describe("DELETE /:username", () => {
        test("should respond with status 200 and delete the user - admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];


            const username = "testname1";
            const response = await request(app)
                .delete(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.body.message).toBe("User deleted");
        });

        test("should respond with status 200 and delete the user - same user", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];


            const username = "testname1";
            const response = await request(app)
                .delete(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.body.message).toBe("User deleted");
        });

        test("throws UnauthorizedError if not same user - not admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname1", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];


            const username = "testname2";
            const response = await request(app)
                .delete(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.status).toEqual(401);
        });

        test("throws NotFoundError if no such user - is admin", async () => {
            // Mock authentication to initiate data needed for ensureAuthenticated middleware
            const loginResponse = await request(app)
                .post("/auth/login")
                .send({ username: "testname2", password: "Password!2" });

            const accessToken = loginResponse.headers["authorization"];


            const username = "testname3";
            const response = await request(app)
                .delete(`/users/${username}`)
                .set("authorization", `Bearer ${accessToken}`);

            expect(response.status).toEqual(404);
        });
    });
});