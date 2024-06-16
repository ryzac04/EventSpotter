"use strict";

const { findAllUsers, findUser, updateUser, deleteUser } = require("./user");
const User = require("../models/user");

jest.mock("../models/user");

describe("User Controller", () => {

    describe("findAllUsers", () => {
        test("should return all users with status 200", async () => {
            const mockUsers = [{ id: 1, username: "testuser" }, { id: 2, username: "anotheruser" }];
            User.findAllUsers.mockResolvedValue(mockUsers);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await findAllUsers(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        test("should call next with error if there is an error", async () => {
            const error = new Error("Something went wrong");
            User.findAllUsers.mockRejectedValue(error);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await findAllUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findUser", () => {
        test("should return a user with status 200", async () => {
            const mockUser = { id: 1, username: "testuser" };
            User.findUser.mockResolvedValue(mockUser);

            const req = { params: { username: "testuser" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await findUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        test("should call next with error if there is an error", async () => {
            const error = new Error("Something went wrong");
            User.findUser.mockRejectedValue(error);

            const req = { params: { username: "testuser" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await findUser(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("updateUser", () => {
        test("should update a user and return with status 200", async () => {
            const mockUser = { id: 1, username: "updatedUser" };
            User.updateUser.mockResolvedValue(mockUser);

            const req = { params: { username: "testuser" }, body: { username: "updatedUser" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await updateUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        test("should call next with error if there is an error", async () => {
            const error = new Error("Something went wrong");
            User.updateUser.mockRejectedValue(error);

            const req = { params: { username: "testuser" }, body: { username: "updatedUser" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await updateUser(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("deleteUser", () => {
        test("should delete a user and return with status 200", async () => {
            User.remove.mockResolvedValue();

            const req = { params: { username: "testuser" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await deleteUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
        });

        test("should call next with error if there is an error", async () => {
            const error = new Error("Something went wrong");
            User.remove.mockRejectedValue(error);

            const req = { params: { username: "testuser" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await deleteUser(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});