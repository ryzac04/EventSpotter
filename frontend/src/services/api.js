
import axios from "axios";
const BASE_URL = process.env.REACT_BASE_URL || "http://localhost:3001";

/**
 * API Class
 * 
 * Static class tying together methods used to get/send to the backend API.
 */

class EventSpotterApi{
    static token;

    /**
     * Make a request to the backend API. 
     * @param {string} endpoint - the endpoint to call.
     * @param {Object} [data={}] - data to send with the request.
     * @param {string} [method="get"] - HTTP method to use; defaults to "get".
     * @param {Object} [extraHeaders={}] - additional headers to include in the request. 
     * @returns {Object} - the response data from the API. 
     * @throws {Array} - an array of error messages if the request fails. 
     */
    static async request(endpoint, data = {}, method = "get", extraHeaders) {

        const url = `${BASE_URL}/${endpoint}`;
        const headers = {
            Authorization: `Bearer ${this.token}`,
            ...extraHeaders
        };
        const params = (method === "get")
            ? data
            : {};
        
        try {
            const response = await axios({ url, method, data, params, headers });
            return response;
        } catch (error) {
            console.error("API Error:", error.response);
            let message = error.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    };

    // API auth routes 

    /**
     * Register a new user. 
     * @param {Object} data - the user data to send. 
     * @returns {Object} - an object containing the access and refresh tokens. 
     * @throws {Error} - throws an error if the signup fails. 
     */
    static async signup(data) {
        try {
            let res = await this.request("auth/register", data, "post");
            const { accessToken, refreshToken } = res.data;

            return { accessToken, refreshToken};
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    };

    /**
     * Log in an existing user. 
     * @param {Object} data - the user data to send. 
     * @returns {Object} - an object containing the access and refresh tokens. 
     * @throws {Error} - throws an error if the login fails. 
     */
    static async login(data) {
        try {
            let res = await this.request("auth/login", data, "post");
            const { accessToken, refreshToken } = res.data;

            return { accessToken, refreshToken };
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    /**
     * Log out the current user.
     * @returns {Object} - the response data from the API.
     * @throws {Error} - throws an error if the logout fails.
     */
    static async logout() {
        try {
            let refreshToken = localStorage.getItem("refreshToken");
            let res = await this.request("auth/logout", {}, "post", {
                "x-refresh-token": refreshToken
            });

            return res.data;
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    // API users routes 

    /**
     * Get the current user's information.
     * @param {string} username - the username of the user to fetch.
     * @returns {Object} - the user data.
     * @throws {Error} - throws an error if fetching the user fails.
     */
    static async getCurrentUser(username) {
        try {
            let res = await this.request(`users/${username}`);
            
            return res.data.user;
        } catch (error) {
            console.error(`Failed to get user ${username}:`, error);
            throw error;
        }
    };

    /**
     * Update the current user's information.
     * @param {string} username - the username of the user to update.
     * @param {Object} data - the user data to update.
     * @returns {Object} - the updated user data.
     * @throws {Error} - throws an error if updating the user fails.
     */
    static async updateUser(username, data) {
        try {
            let res = await this.request(`users/${username}`, data, "patch")
            
            return res.data.user;
        } catch (error) {
            console.error(`Failed to update user info for username ${username}:`, error);
            throw error;
        }   
    };

    /**
     * Delete the current user.
     * @param {string} username - the username of the user to delete.
     * @returns {string} - a message indicating the user was deleted.
     * @throws {Error} - throws an error if deleting the user fails.
     */
    static async deleteUser(username) {
        try {
            let res = await this.request(`users/${username}`, {}, "delete");

            return res.data.message;
        } catch (error) {
            console.error(`Failed to delete user ${username}:`, error);
            throw error;
        }   
    };
};

export default EventSpotterApi;