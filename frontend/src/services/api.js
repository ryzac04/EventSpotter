
import axios from "axios";

const BASE_URL = process.env.REACT_BASE_URL || "http://localhost:3000";

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
            return (await axios({ url, headers, params, method, data })).data;
        } catch (error) {
            console.error("API Error:", error.response);
            let message = error.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // API routes 

    static async signup(data) {
        let res = await this.request("auth/register", data, "post");
        return res;
    };

    static async login(data) {
        let res = await this.request("auth/login", data, "post")
        return res;
    };
};

export default EventSpotterApi;