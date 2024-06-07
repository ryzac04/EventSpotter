"use strict"; 

const argon = require("argon2");
const { JsonWebTokenError } = require("jsonwebtoken");

const db = require("../db/index");
const User = require("./user");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError
} = require("../utils/expressError");
const { hashPassword } = require("./userModelUtils");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");


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
    // validateRequiredFields integration tests 
    test("throws BadRequestError for missing registration data", async () => {
        // missing username
        try {
            await User.register({
                username: "",
                password: "Password!2",
                email: "newuser@email.com",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("User data missing for registration: username.");
        };
        // missing password
        try {
            await User.register({
                username: "newUser",
                password: "",
                email: "newuser@email.com",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("User data missing for registration: password.");
        };
        // missing email
        try {
            await User.register({
                username: "newUser",
                password: "Password!2",
                email: "",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("User data missing for registration: email.");
        };
        // missing multiple fields 
        try {
            await User.register({
                username: "",
                password: "",
                email: "",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("User data missing for registration: username, password, email.");
        };
    });

    test("throws BadRequestError for invalid user data format and/or requirements", async () => {
        // validateUsername - length validation 
        try {
            await User.register({
                username: "RC",
                password: "Password!2",
                email: "newuser@email.com",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("Username must be at least 3 characters long.");
        };
        // validateUsername - valid characters validation 
        try {
            await User.register({
                username: "RC!!",
                password: "Password!2",
                email: "newuser@email.com",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("Username can only contain alphanumeric characters and underscores. Invalid characters found: '!, !'.");
        };
        // validatePassword - length validation 
        try {
            await User.register({
                username: "newUser",
                password: "!2-Ab",
                email: "newuser@email.com",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("Password must be at least 6 characters long.");
        };
        // validatePassword - valid characters validation
        try {
            await User.register({
                username: "newUser",
                password: "password",
                email: "",
                isAdmin: false
            });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("Passowrd must include at least one uppercase letter, digit, special character.");
        };
        // validateEmail - format validation 
        try {
            await User.register({
            username: "newUser",
            password: "Password!2",
            email: "newuseremail.com",
            isAdmin: false
        });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("Invalid email format.");
        };
        // validateIsAdmin boolean validation 
        try {
            await User.register({
            username: "newUser",
            password: "Password!2",
            email: "newuser@email.com",
            isAdmin: "True"
        });
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toEqual("Invalid value for isAdmin. Must be boolean true or false.");
        };
    })
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
            expect(error.message).toEqual("Username 'testname1' is already taken.");
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

        const password = "Password!2";
        await expect(hashPassword(password)).rejects.toThrow(InternalServerError);

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
                email: "testname1@email.com"});
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerError);
            expect(error.message).toEqual("Failed to register new user to the database.");
        } finally {
            db.query.mockRestore();
        };
    });
});

/**
 * authenticate
 */

// describe("authenticate", () => {
//     test("correctly authenticates user", async () => {
//         const user = await User.authenticate("testname1", "password1");
//         expect(user).toHaveProperty("username", "testname1");
//         expect(user).toHaveProperty("email", "testname1@email.com");
//         expect(user).toHaveProperty("isAdmin", false);
//     });

//     test("throws UnauthorizedError if user not found", async () => {
//         try {
//             await User.authenticate({
//                 username: "testname3",
//                 password: "password3"
//             });
//         } catch (error) {
//             expect(error).toBeInstanceOf(UnauthorizedError);
//             expect(error.message).toEqual("User not found.");
//         };
//     });

//     test("throws UnauthorizedError if password is invalid", async () => {
//         try {
//             await User.authenticate({
//                 username: "testname1",
//                 password: "bad-password"
//             });
//         } catch (error) {
//             expect(error).toBeInstanceOf(UnauthorizedError);
//             expect(error.message).toEqual("Invalid password.");
//         };
//     });

//     test("correctly throws InternalServerError", async () => {
//         // Mock db.query to throw an unexpected error
//         jest.spyOn(db, 'query').mockImplementationOnce(() => {
//             throw new Error("Unexpected error");
//         });

//         try {
//             await User.authenticate("testname1", "password1");
//         } catch (error) {
//             expect(error).toBeInstanceOf(InternalServerError);
//             expect(error.message).toEqual("Failed to authenticate user.");
//         } finally {
//             db.query.mockRestore();
//         };
//         // InternalServerErrors for missing data from database. 
//         try {
//             await User.authenticate({
//                 username: "testname1"
//             });
//         } catch (error) {
//             expect(error).toBeInstanceOf(InternalServerError);
//             expect(error.message).toEqual("Failed to authenticate user.");
//         };
//         try {
//             await User.authenticate({
//                 password: "password1"
//             });
//         } catch (error) {
//             expect(error).toBeInstanceOf(InternalServerError);
//             expect(error.message).toEqual("Failed to authenticate user.");
//         };
//     });
// });


/**
 * findUser
 */

// describe("findUser", () => {
//     test("correctly finds user by username", async () => {
//         const user = await User.findUser("testname1");
//         expect(user).toHaveProperty("username", "testname1");
//         expect(user).toHaveProperty("email", "testname1@email.com");
//         expect(user).toHaveProperty("isAdmin", false);
//     });

//     test("throws NotFoundError if user not found", async () => {
//         try {
//             await User.findUser("testname3");
//         } catch (error) {
//             expect(error).toBeInstanceOf(NotFoundError);
//             expect(error.message).toEqual(`Unable to find user: ${username}.`);
//         };
//     });

//     test("correctly throws InternalServerError", async () => {
//         // Mock db.query to throw an unexpected error
//         jest.spyOn(db, 'query').mockImplementationOnce(() => {
//             throw new Error("Unexpected error");
//         });

//         try {
//             await User.findUser("testname1");
//         } catch (error) {
//             expect(error).toBeInstanceOf(InternalServerError);
//             expect(error.message).toEqual("Failed to retrieve user data for username 'testname1' from the database.");
//         } finally {
//             db.query.mockRestore();
//         };
//     });
// });



//   test("find non-existent user", async () => {
//     await expect(User.findUser("nonexistent")).rejects.toThrow(NotFoundError);
//   });

/**
 * findAllUsers
 */

// describe("findAllUsers", () => {

// });

//   test("find all users", async () => {
//     const users = await User.findAllUsers();
//     expect(users.length).toBe(2);
//     expect(users[0]).toHaveProperty("username", "testuser1");
//     expect(users[1]).toHaveProperty("username", "testuser2");
//   });

/**
 * updateUser
 */

// describe("updateUser", () => {

// });

//   test("update user", async () => {
//     const updatedUser = await User.updateUser("testuser1", { email: "newemail@example.com" });
//     expect(updatedUser).toHaveProperty("username", "testuser1");
//     expect(updatedUser).toHaveProperty("email", "newemail@example.com");
//     expect(updatedUser).toHaveProperty("isAdmin", false);
//   });

//   test("update non-existent user", async () => {
//     await expect(User.updateUser("nonexistent", { email: "newemail@example.com" })).rejects.toThrow(NotFoundError);
//   });

/**
 * remove
 */

// describe("remove", () => {
// })

//   test("remove user", async () => {
//     await User.remove("testuser1");
//     await expect(User.findUser("testuser1")).rejects.toThrow(NotFoundError);
//   });

//   test("remove non-existent user", async () => {
//     await expect(User.remove("nonexistent")).rejects.toThrow(NotFoundError);
//   });