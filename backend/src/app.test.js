"use strict"; 

const express = require("express");
const request = require("supertest");
const app = require("./app");
const db = require("../db/index");
const { UnauthorizedError } = require("../utils/expressError");

function createTestApp() {
    const testApp = express();
    testApp.use(express.json());
    
    // Adding test routes for error handling
    testApp.get("/test-error", (req, res, next) => {
        const error = new Error("Test error");
        next(error); // Passes to the generic error handler directly
    });

    testApp.get("/test-custom-error", (req, res, next) => {
        next(new UnauthorizedError("Unauthorized", 401));
    });

    // Use the main app routes and error handlers
    testApp.use(app);

    return testApp;
}

describe("404 Error Handler", () => {
    test("responds with 404 status and error message", async () => {
        const response = await request(app).get("/non-existent-route");
        expect(response.statusCode).toBe(404);
        expect(response.res.statusMessage).toBe("Not Found");
    });
});

describe("Generic Error Handler", () => {
    test("responds with default 500 status and error message", async () => {
        const testApp = createTestApp();
        
        // Make a request to trigger the error
        const response = await request(testApp).get("/test-error");

        // Check that the response has the expected status and error message
        expect(response.statusCode).toBe(500);
        expect(response.res.statusMessage).toBe("Internal Server Error");
    });

    test("responds with specified status and error message", async () => {
        const testApp = createTestApp();
        
        // Make a request to trigger the custom error
        const response = await request(testApp).get("/test-custom-error");

        // Check that the response has the expected status and error message
        expect(response.statusCode).toBe(401);
        expect(response.res.statusMessage).toBe("Unauthorized");
    });
});

afterAll(() => {
    db.end();
});
