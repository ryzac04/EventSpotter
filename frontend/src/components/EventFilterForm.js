
import React, { useState, useEffect } from "react";
import axios from "axios";

import { useAuthContext } from "../contexts/authContext";
import useEndDateTime from "../hooks/useEndDateTime";
import Alert from "./common/Alert";

import "./EventMap.css";

const EventFilterForm = ({
    setEvents,
    userCoords,
    droppedPinCoords,
    mapCenter,
    buttonsDisabled
}) => {
    const { currentUser } = useAuthContext();

    // Filter criteria state
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterDistance, setFilterDistance] = useState(10);
    const { endDateTime, rawEndDateTime, handleEndDateTimeChange, setEndDateTime } = useEndDateTime();
    const [priceMin, setPriceMin] = useState("0");
    const [priceMax, setPriceMax] = useState("");
    const [resultSize, setResultSize] = useState(10);

    const [searchError, setSearchError] = useState(null);
    
    useEffect(() => {

        // Load search criteria from localStorage if available
        const storedSearchKeyword = localStorage.getItem("searchKeyword") || "";
        const storedFilterDistance = localStorage.getItem("filterDistance") || 10;
        const storedEndDateTime = localStorage.getItem("endDateTime") || "";
        const storedPriceMin = localStorage.getItem("priceMin") || "0";
        const storedPriceMax = localStorage.getItem("priceMax") || "";
        const storedResultSize = localStorage.getItem("resultSize") || 10;

        setSearchKeyword(storedSearchKeyword);
        setFilterDistance(parseInt(storedFilterDistance, 10));
        setEndDateTime(storedEndDateTime);
        setPriceMin(storedPriceMin);
        setPriceMax(storedPriceMax);
        setResultSize(parseInt(storedResultSize, 10));
    }, [currentUser]);

    const fetchEvents = async () => {
        try {
            let params = {
                apikey: process.env.REACT_APP_TM_API_KEY,
                keyword: searchKeyword,
                radius: filterDistance,
                endDateTime: endDateTime,
                size: resultSize
            };

            if (userCoords) {
                params.latlong = `${userCoords.lat},${userCoords.lng}`;
            } else if (droppedPinCoords) {
                params.latlong = `${droppedPinCoords.lat},${droppedPinCoords.lng}`;
            } else {
                params.latlong = `${mapCenter.lat},${mapCenter.lng}`;
            };

            const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json`, { params });
            console.log(response);

            if (response.data && response.data._embedded && response.data._embedded.events) {
                const filteredEvents = response.data._embedded.events.filter(event => {
                    if (priceMin !== "" && priceMax !== "") {
                        const min = parseFloat(priceMin);
                        const max = parseFloat(priceMax);
                        const eventPrice = event.priceRanges ? parseFloat(event.priceRanges[0].min) : null;
                        return eventPrice >= min && eventPrice <= max;
                    }
                    // If priceMin or priceMax not provided, filter function returns true - all events will be included, regardless of price range.
                    return true;
                });
                setEvents(filteredEvents);
                setSearchError(null);
                localStorage.setItem("events", JSON.stringify(filteredEvents));
            } else {
                setEvents([]);
                setSearchError("No events found matching your criteria.");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setSearchError("An error occurred while fetching events. Please try again later.");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents();

        // Store search criteria in localStorage
        localStorage.setItem("searchKeyword", searchKeyword);
        localStorage.setItem("filterDistance", filterDistance);
        localStorage.setItem("endDateTime", endDateTime);
        localStorage.setItem("priceMin", priceMin);
        localStorage.setItem("priceMax", priceMax);
        localStorage.setItem("resultSize", resultSize);
    };

    return (
        <div>
            <form>
                <div className="filters">
                    <label>Search:</label>
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <br />
                    <label>Distance (miles):</label>
                    <input
                        type="number"
                        value={filterDistance}
                        min="0"
                        onChange={(e) => setFilterDistance(e.target.value)}
                    />
                    <br />
                    <label>End Date Time:</label>
                    <input
                        type="datetime-local"
                        value={rawEndDateTime}
                        onChange={handleEndDateTimeChange}
                    />
                    <br />
                    <label>Price Min:</label>
                    <input
                        type="number"
                        value={priceMin}
                        min="0"
                        onChange={(e) => setPriceMin(e.target.value)}
                    />
                    <br />
                    <label>Price Max:</label>
                    <input
                        type="number"
                        value={priceMax}
                        min="0"
                        onChange={(e) => setPriceMax(e.target.value)}
                    />
                    <br />
                    <label>Result Size:</label>
                    <input
                        type="number"
                        value={resultSize}
                        min="1"
                        onChange={(e) => setResultSize(e.target.value)}
                    />
                </div>
            </form>
            <button disabled={buttonsDisabled} onClick={handleSearch}>Search</button>
            {searchError && <Alert type="danger" messages={[searchError]} />}
        </div> 
    );
};

export default EventFilterForm;