
import { useState } from "react";
import { formatDateToISO } from "../utils/appUtils";

// Custom hook to format and handle change in end date/time input - found in EventFilterForm.js
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