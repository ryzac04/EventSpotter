
import { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

/**
 * AuthContext
 * 
 * Provides authentication-related data and methods to components throughout the application.
 * It uses the useAuth hook to manage authentication state and actions.
 * 
 * AuthProvider Component
 * 
 * Wraps its children with AuthContext.Provider and supplies the authentication state and methods.
 * 
 * Props:
 * - children: the components that will be wrapped by the AuthProvider.
 * 
 * useAuthContext Hook
 * 
 * A custom hook that allows components to easily consume the authentication context.
 */

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth} >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);