
import { createContext, useState } from "react";

/**
 * ErrorProvider Component
 * 
 * Provides a context for managing error state across components.
 * Uses React's Context API to propagate error state and setter functions. 
 * 
 * @param {Object} props - the component props.
 * @param {ReactNode} props.children - the child components to be wrapped by the ErrorProvider.
 * 
 * @returns {JSX.Element} - JSX element wrapping the child components with error context.
 * 
 * Found in: ErrorContext.js
 */

const ErrorContext = createContext();

const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);
    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export {ErrorContext, ErrorProvider}