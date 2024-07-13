
import { createContext, useState } from "react";

/**
 * MessageProvider Component
 * 
 * Provides a context for managing message state across components.
 * Uses React's Context API to propagate message state and setter functions. 
 * 
 * @param {Object} props - the component props.
 * @param {ReactNode} props.children - the child components to be wrapped by the MessageProvider.
 * 
 * @returns {JSX.Element} - JSX element wrapping the child components with message context.
 * 
 */

const MessageContext = createContext();

const MessageProvider = ({ children }) => {
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState([]);
    const [info, setInfo] = useState([]);

    const clearError = () => setError([]);
    const clearSuccess = () => setSuccess([]);
    const clearInfo = () => setInfo([]);

    return (
        <MessageContext.Provider value={{ error, setError, clearError, success, setSuccess, clearSuccess, info, setInfo, clearInfo }}>
            {children}
        </MessageContext.Provider>
    );
};

export {MessageContext, MessageProvider}