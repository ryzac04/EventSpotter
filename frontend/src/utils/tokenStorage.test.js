
import { saveToken, getToken, clearToken } from "./tokenStorage";

describe("tokenStorage utility functions", () => {
    beforeEach(() => {
        // Clear all items from localStorage before each test
        localStorage.clear();
    });

    test("saveToken stores the token in localStorage", () => {
        const token = "sampleToken";
        saveToken(token);
        expect(localStorage.getItem("ESAppAccessToken")).toBe(token);
    });

    test("getToken retrieves the token from localStorage", () => {
        const token = "sampleToken";
        localStorage.setItem("ESAppAccessToken", token);
        console.log("TOKEN", token);
        expect(getToken()).toBe(token);
    });

    test("clearToken removes the token from localStorage", () => {
        const token = "sampleToken";
        localStorage.setItem("ESAppAccessToken", token);
        clearToken();
        expect(localStorage.getItem("ESAppAccessToken")).toBeNull();
    });
});
