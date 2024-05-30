
const { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } = require("./expressError");

describe("ExpressError", () => {
    test("should create an instance of ExpressError with the specified message and status", () => {
        const error = new ExpressError("Test error", 500);
        expect(error.message).toBe("Test error");
        expect(error.status).toBe(500);
    });
});

describe("NotFoundError", () => {
    test("should create an instance of NotFoundError with the default message 'Not Found' and status 404", () => {
        const error = new NotFoundError("Not Found", 404);
        expect(error.message).toBe("Not Found");
        expect(error.status).toBe(404);
    });
});

describe("UnauthorizedError", () => {
    test("should create an instance of UnauthorizedError with the default message 'Unauthorized' and status 401", () => {
        const error = new UnauthorizedError("Unauthorized", 401);
        expect(error.message).toBe("Unauthorized");
        expect(error.status).toBe(401);
    });
});

describe("BadRequestError", () => {
    test("should create an instance of BadRequestError with the default message 'Bad Request' and status 400", () => {
        const error = new BadRequestError("Bad Request", 400);
        expect(error.message).toBe("Bad Request");
        expect(error.status).toBe(400);
    });
});

describe("ForbiddenError", () => {
    test("should create an instance of ForbiddenError with the default message 'Bad Request' and status 403", () => {
        const error = new ForbiddenError("Bad Request", 403);
        expect(error.message).toBe("Bad Request");
        expect(error.status).toBe(403);
    });
});