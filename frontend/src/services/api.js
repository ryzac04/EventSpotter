
import axios from "axios";
const BASE_URL = process.env.REACT_BASE_URL || "http://localhost:3001";

/**
 * API Class
 * 
 * Static class tying together methods used to get/send to the backend API. 
 */

class EventSpotterApi{
    static token;

    static async request(endpoint, data = {}, method = "get", extraHeaders) {
        console.debug("API Call:", endpoint, data, method);

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

    static async refreshToken() {
        try {    
            let refreshToken = localStorage.getItem("refreshToken");
            let res = await this.request("auth/refresh", { refreshToken }, "post");
            const { newAccessToken } = res.data;

            return { newAccessToken };
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            throw error;
        }
    };

    // API users routes 

    static async getCurrentUser(username) {
        try {
            let res = await this.request(`users/${username}`);
            
            return res.data.user;
        } catch (error) {
            console.error(`Failed to get user ${username}:`, error);
            throw error;
        }
    };

    static async updateUser(username, data) {
        try {
            let res = await this.request(`users/${username}`, data, "patch")
            
            return res.data.user;
        } catch (error) {
            console.error(`Failed to update user info for username ${username}:`, error);
            throw error;
        }   
    };

    static async deleteUser(username) {
        try {
            let res = await this.request(`users/${username}`, {}, "delete");

            return res.data.message;
        } catch (error) {
            console.error(`Failed to delete user ${username}:`, error);
            throw error;
        }   
    };
    
    // Fetch all users (admin action) 
    static async getAllUsers() {
        try {
            let res = await this.request("users");
            
            return res.data.users;
        } catch (error) {
            console.error("Failed to get all users:", error);
            throw error; 
        }
    };

    // Register new user (admin action)
    static async adminRegisterUser(data) {
        try {
            let res = await this.request("users", data, "post");
            const { accessToken, refreshToken } = res.data;

            return { accessToken, refreshToken };
        } catch (error) {
            console.error("Failed to register new user:", error);
            throw error;
        }
    };
};

export default EventSpotterApi;