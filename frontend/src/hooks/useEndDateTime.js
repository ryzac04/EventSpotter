
import { useState } from "react";
import { formatDateToISO } from "../utils/appUtils";

/**
 * useEndDateTime custom hook
 * 
 * Manages and formats the end date/time input.
 * 
 * @returns {Object} - an object containing the endDateTime, setEndDateTime function, rawEndDateTime, and handleEndDateTimeChange function.
 * 
 * Found in: EventFilterForm.js
 */

const useEndDateTime = () => {
    const [endDateTime, setEndDateTime] = useState("");
    const [rawEndDateTime, setRawEndDateTime] = useState("");

    const handleEndDateTimeChange = (e) => {
        const dateTimeString = e.target.value;
        setRawEndDateTime(dateTimeString);
        if (dateTimeString) {
            const date = new Date(dateTimeString);
            const formattedDateTime = formatDateToISO(date);
            setEndDateTime(formattedDateTime);
        } else {
            setEndDateTime(null); // Handle clearing the date
        }
    };

    return {
        endDateTime,
        setEndDateTime,
        rawEndDateTime,
        handleEndDateTimeChange
    };
};

export default useEndDateTime;