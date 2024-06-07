"use strict";

const argon = require("argon2");

const db = require("../db/index");

const argon2TimeCost = require("../config/index");

const {
    checkDuplicateUsername,
    checkUserExists,
    hashPassword,
    verifyPassword,
    sqlForPartialUpdate
} = require("./userModelUtils");
 
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError
} = require("./expressError");

const mockDbQuery = jest.fn();

beforeAll(() => {
    // Mock the db.query function
    db.query = mockDbQuery;
});

afterEach(() => {
    jest.restoreAllMocks();
})

afterAll(() => {
    // Restore db.query to its original implementation
    db.query = jest.requireActual("../db/index").query;
    db.end();
});

describe("checkDuplicateUsername", () => {
    test("does not throw error if username is not taken", async () => {
        const username = "newuser";
        // Mock the database query result
        mockDbQuery.mockResolvedValue({ rows: [] });

        await expect(checkDuplicateUsername(username)).resolves.not.toThrow();
    });

    test("throws BadRequestError if username is already taken", async () => {
        const username = "testuser";
        // Mock the database query result
        mockDbQuery.mockResolvedValue({ rows: [{ username }] });

        await expect(checkDuplicateUsername(username)).rejects.toThrow(BadRequestError);
    });
});

describe("checkUserExists", () => {
    test("does not throw error if user exists", () => {
        const user = { username: "existingUser" };
        expect(() => checkUserExists({ user })).not.toThrow();
    });

    test("throws NotFoundError if user is not found", () => {
        const user = null;
        expect(() => checkUserExists({ user })).toThrow(NotFoundError);
    });
});

describe("hashPassword", () => {
    test("returns a hashed password", async () => {
        const password = "Password!2";
        const hashedPassword = await hashPassword(password);
        expect(hashedPassword).toBeTruthy();
        expect(typeof hashedPassword).toBe("string");
    });

    test("throws InternalServerError if hashing fails", async () => {
        // Mock argon.hash to throw an error
        jest.spyOn(argon, 'hash').mockRejectedValue(new Error("Hashing failed"));

        const password = "Password!2";
        await expect(hashPassword(password)).rejects.toThrow(InternalServerError);
    });
});

describe("verifyPassword", () => {
    test("does not throw error if password is valid", async () => {
        const user = { password: await argon.hash("Password!2", argon2TimeCost) };
        const password = "Password!2";
        await expect(verifyPassword({ user }, password)).resolves.not.toThrow();
    });

    test("throws UnauthorizedError if password is invalid", async () => {
        const user = { password: await argon.hash("testPassword", argon2TimeCost) };
        const password = "incorrectPassword";
        await expect(verifyPassword({ user }, password)).rejects.toThrow(UnauthorizedError);
    });
});

describe("sqlForPartialUpdate", () => {
    test("should construct SQL components for updating partial data", () => {
        const dataToUpdate = {
            firstName: "John",
            age: 30,
            city: "New York"
        };

        const jsToSql = {
            firstName: "first_name",
            age: "age",
            city: "city"
        };

        const expectedResult = {
            setCols: '"first_name"=$1, "age"=$2, "city"=$3',
            values: ["John", 30, "New York"]
        };

        expect(sqlForPartialUpdate(dataToUpdate, jsToSql)).toEqual(expectedResult);
    });

    test("should throw an error when no data is provided", () => {
        const dataToUpdate = {};
        const jsToSql = {};

        expect(() => {
            sqlForPartialUpdate(dataToUpdate, jsToSql);
        }).toThrow(BadRequestError);
    });
});