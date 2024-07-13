import { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

/**
 * AuthContext
 * Provides authentication-related data and methods to components throughout the application.
 * It uses the useAuth hook to manage authentication state and actions.
 */

const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps its children with AuthContext.Provider and supplies the authentication state and methods.
 * 
 * @param {Object} props - the component props.
 * @param {ReactNode} props.children - the child components to be wrapped by the AuthProvider.
 * 
 * @returns {JSX.Element} - JSX element wrapping the child components with authentication context.
 * 
 * Found in: AuthContext.js
 */

export const AuthProvider = ({ children }) => {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * useAuthContext Hook
 * A custom hook that allows components to easily consume the authentication context.
 * 
 * @returns {Object} - authentication context value.
 */

export const useAuthContext = () => useContext(AuthContext);