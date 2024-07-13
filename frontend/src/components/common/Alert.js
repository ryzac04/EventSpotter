
import React, { useContext } from "react";
import { ErrorContext } from "../../contexts/ErrorContext";
import { formatErrorMessages } from "../../utils/errorUtils";

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

const Alert = ({ type = "danger", messages = [] }) => {
    const { error } = useContext(ErrorContext);
    if (!error && messages.length === 0) return null;

    const errorMessages = formatErrorMessages(error);
    return (
        <div className="alert-container mt-4">
            <div className={`alert alert-${type}`} role="alert">
                <ul className="list-unstyled mb-0">
                    {errorMessages.map((error, index) => (
                        <li className="mb-0 small" key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Alert;