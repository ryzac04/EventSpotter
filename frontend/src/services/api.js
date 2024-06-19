
import axios from "axios";
import { saveToken } from "../utils/tokenStorage";

const BASE_URL = process.env.REACT_BASE_URL || "http://localhost:3001";

/**
 * API Class
 * 
 * Static class tying together methods used to get/send to the backend API. 
 */

class EventSpotterApi{
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${EventSpotterApi.token}` };
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
    }

    // API routes 

    static async signup(data) {
        try {
            let res = await this.request("auth/register", data, "post");
            const { user, accessToken, refreshToken } = res.data;

            return {user: user, accessToken, refreshToken};
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    };
};

export default EventSpotterApi;