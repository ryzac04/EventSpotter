"use strict"; 

const argon = require("argon2");

const db = require("../db/index");
const User = require("./user");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError
} = require("../utils/expressError");
const { hashPassword } = require("../utils/userModelUtils");

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

/**
 * register
 */

describe("register", () => {
    test("correctly registers new user", async () => {
        const user = await User.register({
            username: "newUser",
            password: "Password!2",
            email: "newuser@email.com",
            isAdmin: false
        });
        expect(user).toHaveProperty("username", "newUser");
        expect(user).toHaveProperty("email", "newuser@email.com");
        expect(user).toHaveProperty("isAdmin", false);
    });

    // checkDuplicateUsername
    test("throws BadRequestError for duplicate user", async () => {
        try {
            await User.register({
                username: "testname1",
                password: "Password!2",
                email: "testname1@email.com",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("Username testname1 is already taken.");
        };
    });
    
    // hashPassword 
    test("correctly hashes a password", async () => {
        const password = "Password!2";
        const hashedPassword = await hashPassword(password);

        expect(hashedPassword).not.toEqual(password);
        expect(await argon.verify(hashedPassword, password)).toBeTruthy();
    })

    test("correctly throws InternalServerError if password hashing fails", async () => {
        jest.spyOn(argon, 'hash').mockImplementationOnce(() => {
            throw new Error("Unexpected error while hashing password.");
        });
        try {
            const password = "Password!2";
            await hashPassword(password);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerError);
            expect(error.message).toEqual("Failed to hash password.");
        }
        argon.hash.mockRestore();
    });

    test("correctly throws InternalServerError for unexpected database behavior", async () => {
        // Mock db.query to throw an unexpected error
        jest.spyOn(db, 'query').mockImplementationOnce(() => {
            throw new Error("Unexpected error for user registration.");
        });

        try {
            await User.register({
                username: "testname1",
                password: "Password!2",
                email: "testname1@email.com",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerError);
            expect(error.message).toEqual("Failed to register new user testname1 to the database.");
        } finally {
            db.query.mockRestore();
        };
    });
});

/**
* authenticate
*/

describe("authenticate", () => {
    test("correctly authenticates user", async () => {
        const user = await User.authenticate("testname1", "Password!2");
        expect(user).toHaveProperty("username", "testname1");
        expect(user).toHaveProperty("email", "testname1@email.com");
        expect(user).toHaveProperty("isAdmin", false);
    });

    test("throws UnauthorizedError if user not found", async () => {
        try {
            await User.authenticate("testname3", "Password!2");
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
            expect(error.message).toEqual("User not found.");
        };
    });

    test("throws UnauthorizedError if password is invalid", async () => {
        try {
            await User.authenticate("testname1", "bad-password");
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
            expect(error.message).toEqual("Invalid password.");
        };
    });

    test("correctly throws InternalServerError", async () => {
        // Mock db.query to throw an unexpected error
        jest.spyOn(db, 'query').mockImplementationOnce(() => {
            throw new Error("Unexpected error");
        });

        try {
            await User.authenticate("testname1", "password1");
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerError);
            expect(error.message).toEqual("Failed to authenticate testname1.");
        } finally {
            db.query.mockRestore();
        };
    });
});

/**
* findUser
*/

describe("findUser", () => {
    test("correctly finds user by username", async () => {
        const user = await User.findUser("testname1");
        expect(user).toHaveProperty("username", "testname1");
        expect(user).toHaveProperty("email", "testname1@email.com");
        expect(user).toHaveProperty("isAdmin", false);
    });

    test("throws NotFoundError if user not found", async () => {
        try {
            await User.findUser("testname3");
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toEqual("Unable to find user.");
        };
    });

    test("correctly throws InternalServerError", async () => {
        // Mock db.query to throw an unexpected error
        jest.spyOn(db, 'query').mockImplementationOnce(() => {
            throw new Error("Unexpected error");
        });

        try {
            await User.findUser("testname1");
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerError);
            expect(error.message).toEqual("Failed to retrieve user data for username testname1 from the database.");
        } finally {
            db.query.mockRestore();
        };
    });
});
    
/**
* findAllUsers
*/

describe("findAllUsers", () => {
    test("correctly finds all users", async () => {
        const users = await User.findAllUsers();
        expect(users.length).toBe(2);
        expect(users[0]).toHaveProperty("username", "testname1");
        expect(users[1]).toHaveProperty("username", "testname2");
    });
    test("correctly throws InternalServerError", async () => {
        // Mock db.query to throw an unexpected error
        jest.spyOn(db, 'query').mockImplementationOnce(() => {
            throw new Error("Unexpected error");
        });

        try {
            await User.findAllUsers();
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerError);
            expect(error.message).toEqual("Failed to retrieve all users from the database.");
        } finally {
            db.query.mockRestore();
        };
    });
});

/**
* updateUser
*/

describe("updateUser", () => {
    test("correctly updates user information", async () => {
        const updatedUser = await User.updateUser("testname1", { password: "Password!2", email: "newemail@example.com" });
        expect(updatedUser).toHaveProperty("username", "testname1");
        expect(updatedUser).toHaveProperty("email", "newemail@example.com");
        expect(updatedUser).toHaveProperty("isAdmin", false);
        expect(updatedUser).not.toHaveProperty("password");
    });

    test("correctly updates user information if no password in data", async () => {
        const updatedUser = await User.updateUser("testname2", { email: "newemail@example.com", isAdmin: false });
        expect(updatedUser).toHaveProperty("username", "testname2");
        expect(updatedUser).toHaveProperty("email", "newemail@example.com");
        expect(updatedUser).toHaveProperty("isAdmin", false);
        expect(updatedUser).not.toHaveProperty("password");
    });

    test("throws NotFoundError if user not found", async () => {
        try {
            const user = {
                username: "testname3",
                password: "Password!2",
                email: "newemail@example.com",
                isAdmin: false
            }
            await User.updateUser("testname3", user);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toEqual("Unable to find user.");
        };
    });

    test("correctly throws InternalServerError", async () => {
        // Mock db.query to throw an unexpected error
        jest.spyOn(db, 'query').mockImplementationOnce(() => {
            throw new Error("Unexpected error");
        });

        try {
            await User.updateUser("username1");
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerError);
            expect(error.message).toEqual("Failed to update user data for username username1 to the database.");
        } finally {
            db.query.mockRestore();
        };
    });
});

/**
* remove
*/

describe("remove", () => {
    test("successfully removes user", async () => {
        await User.remove("testname1");
        const res = await db.query(
            "SELECT * FROM users WHERE username='testname1'");
        expect(res.rows.length).toEqual(0);
    });

    test("remove non-existent user", async () => {
        await expect(User.remove("nonexistent")).rejects.toThrow(NotFoundError);
    });
});
