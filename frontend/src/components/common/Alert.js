
import React, { useContext } from "react";
import { ErrorContext } from "../../contexts/ErrorContext";

import "./Alert.css";

/** Alert Component
 * 
 * Presentational component for bootstrap-style alerts. 
 * 
 * Found in: 
 * - SignupForm.js
 * - LoginForm.js
 * - Profile.js
 * - PermissionModal.js
 * - DroppedPin.js
 * - AutocompleteSearch.js
 * - Directions.js
 * - EventFilterForm.js
 */ 

const Alert = ({ type = "danger", messages = [] }) => {
    const { error } = useContext(ErrorContext);
    if (!error && messages.length === 0) return null;

    const errorMessages = error ? [error] : messages;

    return (
        <div className="alert-container mt-4">
            <div className={`alert alert-${type}`} role="alert">
                {errorMessages.map((errorMessage, index) => (
                    <p className="mb-0 small" key={index}>{errorMessage}</p>
                ))}
            </div>
        </div>
    );
};

export default Alert;