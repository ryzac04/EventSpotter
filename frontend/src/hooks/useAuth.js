
import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";

import EventSpotterApi from "../services/api";
import useLocalStorage from "./useLocalStorage";

/**
 * useAuth custom hook
 * 
 * Manages authentication state and actions for login, logout, signup, and token refresh.
 * Uses local storage to persist access and refresh tokens.
 * 
 * State:
 * - token: current access token.
 * - refreshToken: current refresh token.
 * - currentUser: currently authenticated user.
 * - infoLoaded: Boolean indicating whether user info has been loaded.
 * 
 * Methods:
 * - signup: registers a new user and sets tokens.
 * - login: authenticates a user and sets tokens.
 * - logout: logs out the user, clears tokens and user state.
 * - updateUser: updates user profile.
 * - refreshAccessToken: refreshes the access token.
 * 
 * Effects:
 * - Loads user info when the access token changes.
 */

const useAuth = () => {
    const [token, setAccessToken] = useLocalStorage("accessToken");
    const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken");
    const [currentUser, setCurrentUser] = useState(null);
    const [infoLoaded, setInfoLoaded] = useState(false);

    console.debug(
        "App",
        "infoLoaded=", infoLoaded,
        "currentUser=", currentUser,
        "token=", token
    );

    useEffect(() => {
        const loadUserInfo = async () => {
            if (token) {
                try {
                    let { username } = decodeToken(token);
                    EventSpotterApi.token = token;
                    let currentUser = await EventSpotterApi.getCurrentUser(username);
                    
                    setCurrentUser(currentUser);
                    setInfoLoaded(true);
                } catch (error) {
                    console.error("Problem loading user info", error);
                    setCurrentUser(null);
                    setInfoLoaded(true);
                }
            }
            setInfoLoaded(true);
        }
        setInfoLoaded(false);
        loadUserInfo();
    }, [token]);

    const updateTokens = (accessToken, refreshToken) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const signup = async (signupData) => {
        try {
            const { accessToken, refreshToken } = await EventSpotterApi.signup(signupData);
            updateTokens(accessToken, refreshToken);
            return { success: true };
        } catch (error) {
            console.error("Signup failed:", error);
            return { success: false, error };
        }
    };

    const login = async (loginData) => {
        try {
            const { accessToken, refreshToken } = await EventSpotterApi.login(loginData);
            updateTokens(accessToken, refreshToken);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error };
        }
    };

    const logout = async () => {
        try {
            await EventSpotterApi.logout();
            setCurrentUser(null);
            localStorage.clear();
            return { success: true };
        } catch (error) {
            console.error("Logout failed:", error);
            return { success: false, error };
        }
    };

    const updateUser = async (username, updatedUserData) => {
        try {
            const updatedUser = await EventSpotterApi.updateUser(username, updatedUserData);
            setCurrentUser(updatedUser);

            return { success: true };
        } catch (error) {
            console.error("Failed to update user:", error);
            return { success: false, error };
        }
    };

    const refreshAccessToken = async () => {
        try {
            const { newAccessToken } = await EventSpotterApi.refreshToken();
            setAccessToken(newAccessToken);
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            return { success: false, error };
        }
    };

    return {
        currentUser,
        setCurrentUser,
        infoLoaded,
        signup,
        login,
        logout,
        updateUser,
        refreshAccessToken
    };
};

export default useAuth;