
import React, { useContext } from "react";
import { MessageContext } from "../../contexts/MessageContext";
import { formatMessages } from "../../utils/messageUtils";

/** Alert Component
 * 
 * Presentational component for bootstrap-style alerts. 
 * 
 * Found in: 
 * - EventMap.js 
 * - SignupForm.js
 * - LoginForm.js
 * - Profile.js
 */ 

const Alert = () => {
    const { error, success, info } = useContext(MessageContext);

    const errorMessages = formatMessages(error);
    const successMessages = formatMessages(success);
    const infoMessages = formatMessages(info);

    if (!errorMessages.length && !successMessages.length && !infoMessages.length) {
        return null;
    }

    return (
        <div className="alert-container mt-4">
            {errorMessages.length > 0 && (
                <div className="alert alert-danger" role="alert">
                    <ul className="list-unstyled mb-0">
                        {errorMessages.map((error, index) => (
                            <li className="mb-0 small" key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            {successMessages.length > 0 && (
                <div className="alert alert-success" role="alert">
                    <ul className="list-unstyled mb-0">
                        {successMessages.map((message, index) => (
                            <li className="mb-0 small" key={index}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}
            {infoMessages.length > 0 && (
                <div className="alert alert-info" role="alert">
                    <ul className="list-unstyled mb-0">
                        {infoMessages.map((message, index) => (
                            <li className="mb-0 small" key={index}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Alert;