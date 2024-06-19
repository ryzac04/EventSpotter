
import { saveToken, getToken, clearToken } from "./tokenStorage";

describe("tokenStorage utility functions", () => {
    beforeEach(() => {
        // Clear all items from localStorage before each test
        localStorage.clear();
    });

    test("saveToken stores the token in localStorage", () => {
        const accessToken = "sampleAccessToken";
        const refreshToken = "sampleRefreshToken";
        saveToken(accessToken, refreshToken);
        expect(localStorage.getItem("accessToken")).toBe(accessToken);
        expect(localStorage.getItem("refreshToken")).toBe(refreshToken);
    });

    test("getToken retrieves the correct token in localStorage", () => {
        const accessToken = "sampleAccessToken";
        const refreshToken = "sampleRefreshToken";
        saveToken(accessToken, refreshToken);
        expect(getToken("accessToken")).toBe(accessToken);
        expect(getToken("refreshToken")).toBe(refreshToken);
    });

    test("clearToken removes the token from localStorage", () => {
        const token = "sampleToken";
        localStorage.setItem("accessToken", token);
        clearToken();
        expect(getToken("accessToken")).toBeNull();
    });
});
