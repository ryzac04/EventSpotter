
import EventSpotterApi from "./api";
import { saveToken } from "../utils/tokenStorage";

const signup = async (signupData) => {
    try {
        const {user, accessToken, refreshToken} = await EventSpotterApi.signup(signupData);
        saveToken(accessToken);
        return { success: true, user };
    } catch (error) {
        console.error("Signup failed:", error);
        return { success: false, error };
    }
};

export {
    signup
};