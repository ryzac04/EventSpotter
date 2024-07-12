
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
    const errorsList = errorMessages[0].split(". ");
    return (
        <div className="alert-container mt-4">
            <div className={`alert alert-${type}`} role="alert">
                <ul className="list-unstyled mb-0">
                    {errorsList.map((error, index) => (
                        <li className="mb-0 small" key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Alert;