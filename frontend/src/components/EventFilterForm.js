
import React, { useState, useEffect } from "react";
import axios from "axios";

import { useAuthContext } from "../contexts/authContext";
import useEndDateTime from "../hooks/useEndDateTime";
import Alert from "./common/Alert";

/**
 * EventFilterForm Component
 * 
 * Renders a form for filtering events based on search criteria such as keyword, distance, date/time, price range, and result list size. 
 * It interacts with the Ticketmaster API to fetch events based on the provided filters and displays any errors encountered during the fetch process. 
 * 
 * @param {Object} props - the component props.
 * @param {function} props.setEvents - function to set the state of the array of events fetched from the API.
 * @param {Object} props.userCoords - the coordinates of the user's location.
 * @param {Object} props.droppedPinCoords - the coordinates of the dropped pin.
 * @param {Object} props.mapCenter - the coordinates of the map center.
 * @param {boolean} props.buttonsDisabled - indicates whether buttons are disabled.
 * @param {string} props.error - error message to display if the search fails.
 * @param {function} props.setError - function to set the state of the search error message.
 *
 * @returns {JSX.Element} - JSX element representing the event filter form.
 * 
 * Other components used: Alert
 * Context used: useAuthContext
 * Custom hook used: useEndDateTime
 * This component found in: EventMap.js
 */

const EventFilterForm = ({
    setEvents,
    userCoords,
    droppedPinCoords,
    mapCenter,
    buttonsDisabled,
    error,
    setError
}) => {
    const { currentUser } = useAuthContext();

    // Filter criteria state
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterDistance, setFilterDistance] = useState(10);
    const { endDateTime, rawEndDateTime, handleEndDateTimeChange, setEndDateTime } = useEndDateTime();
    const [priceMin, setPriceMin] = useState("0");
    const [priceMax, setPriceMax] = useState("");
    const [resultSize, setResultSize] = useState(10);
    
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
                setError(null);
                localStorage.setItem("events", JSON.stringify(filteredEvents));
            } else {
                setEvents([]);
                setError("No events found matching your criteria.");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setError("An error occurred while fetching events. Please try again later.");
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
        <div className="EventFilterForm">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h3 className="heading-text">Find Events</h3>
                <div className="card">
                    <div className="card-body">
                        <form className="mb-4" onSubmit={handleSearch}>
                            <div className="form-group mb-2">
                                <label className="form-label" htmlFor="username">Search:</label>
                                <input
                                    className="form-control"
                                    id="username"
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label" htmlFor="distance">Distance (miles):</label>
                                <input
                                    className="form-control"
                                    id="distance"
                                    type="number"
                                    value={filterDistance}
                                    min="0"
                                    onChange={(e) => setFilterDistance(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label" htmlFor="end-date-time">End Date Time:</label>
                                <input
                                    className="form-control"
                                    id="end-date-time"
                                    type="datetime-local"
                                    value={rawEndDateTime}
                                    onChange={handleEndDateTimeChange}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label" htmlFor="price-min">Price Min:</label>
                                <input
                                    className="form-control"
                                    id="price-min"
                                    type="number"
                                    value={priceMin}
                                    min="0"
                                    onChange={(e) => setPriceMin(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label" htmlFor="price-max">Price Max:</label>
                                <input
                                    className="form-control"
                                    id="price-max"
                                    type="number"
                                    value={priceMax}
                                    min="0"
                                    onChange={(e) => setPriceMax(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label" htmlFor="result-size">Result Size:</label>
                                <input
                                    className="form-control"
                                    id="result-size"
                                    type="number"
                                    value={resultSize}
                                    min="1"
                                    onChange={(e) => setResultSize(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary mt-2" type="submit" disabled={buttonsDisabled}>Search</button>
                        </form>
                        {error && <Alert type="danger" messages={[error]} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventFilterForm;