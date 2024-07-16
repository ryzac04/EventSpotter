
import { useState, useEffect } from "react";
import { useMap, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { fromLatLng } from "react-geocode";
import { v4 as uuidv4 } from "uuid";

import "./AutocompleteSearch.css";

/**
 * AutocompleteSearch Component
 * 
 * Renders an input for address autocomplete using Google Maps Places API. 
 * When an address is selected, it places a marker on the map and stores the location in localStorage.
 * 
 * @param {Object} props - the component props.
 * @param {string} props.selectedMarkerId - the ID of the currently selected marker.
 * @param {function} props.setSelectedMarkerId - function to set the selected marker ID.
 * @param {function} props.setInfoWindowOpen - function to set the state of InfoWindow visibility.
 * @param {Object} props.autoSearchMarker - marker object for the auto-complete search result.
 * @param {function} props.setAutoSearchMarker - function to set the state of the auto-complete search marker.
 * @param {boolean} props.buttonsDisabled - indicates whether buttons are disabled.
 * @param {function} props.setError - function to set error state or display an error message.
 * 
 * @returns {JSX.Element} - JSX element representing the AutocompleteSearch component.
 * 
 * Custom hooks used: useMap
 * Uses fromLatLng from react-geocode for reverse geocoding.
 * Other components used are from @vis.gl/react-google-maps library.
 * This component found in: EventMap.js
 */

const AutocompleteSearch = ({
    selectedMarkerId,
    setSelectedMarkerId,
    setInfoWindowOpen,
    autoSearchMarker,
    setAutoSearchMarker,
    buttonsDisabled,
    setError
}) => {
    const map = useMap();
    
    const [autocomplete, setAutocomplete] = useState(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setupAutocomplete();
    }, []);

    const handleLocationSelect = async () => {
        if (!autocomplete || !map) return;

        const place = await autocomplete.getPlace();

        if (!inputValue || !place || !place.geometry || !place.formatted_address) {
            setInputValue("");
            return;
        }

        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        const location = { lat: latitude, lng: longitude };
        // Store location in localStorage
        localStorage.setItem("autoSearchCoords", JSON.stringify(location));

        try {
            const response = await fromLatLng(latitude, longitude);
            console.log("SEARCH RESPONSE", response);
            const autoSearchAddress = response.results[0].formatted_address;
            localStorage.setItem("autoSearchAddress", autoSearchAddress);

            const newMarker = {
                id: uuidv4(),
                position: location,
                address: place.formatted_address
            };
            localStorage.removeItem("autoSearchMarker");
            localStorage.setItem("autoSearchMarker", JSON.stringify(newMarker));

            map.setCenter(location);
            setAutoSearchMarker(newMarker);
            setInputValue("");
        } catch (error) {
            console.error("Geocoding error:", error);
            setError("Error retrieving this location. Please try again.");
        }
    };

    const setupAutocomplete = () => {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            {
                fields: ["formatted_address", "geometry"]
            }
        );
        autocompleteInstance.setFields(["formatted_address", "geometry"]);
        autocompleteInstance.addListener("place_changed", handleLocationSelect);
        setAutocomplete(autocompleteInstance);
    };

    const handleAutoSearchMarkerClick = (id, address) => {
        setSelectedMarkerId(id === selectedMarkerId ? null : id);
        localStorage.removeItem("eventAddress");
        localStorage.setItem("eventAddress", address);
        setInfoWindowOpen(true);
    };

    const handleInfoWindowClose = () => {
        setInfoWindowOpen(false);
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLocationSelect();
    };

    const handlePreventEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    return (
        <div className="autocomplete-container">
            <form onSubmit={handleSubmit}>
            <input
                id="autocomplete"
                className="autocomplete-input"
                type="text"
                placeholder="Enter address"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handlePreventEnter}
            />
            <button className="autocomplete-button" type="submit" disabled={buttonsDisabled} >Search</button>
            </form>
            {autoSearchMarker && (
                <AdvancedMarker
                    key={autoSearchMarker.id}
                    position={autoSearchMarker.position}
                    onClick={() => handleAutoSearchMarkerClick(autoSearchMarker.id, autoSearchMarker.address)}
                >
                    <Pin
                        className={selectedMarkerId === autoSearchMarker.id ? "selected-pin" : "pin"}
                        background={selectedMarkerId === autoSearchMarker.id ? "tomato" : "gold"}
                        borderColor={"black"}
                        glyphColor={"black"}
                    />
                    {selectedMarkerId === autoSearchMarker.id && (
                        <InfoWindow
                            className="info-window"
                            position={autoSearchMarker.position}
                            onCloseClick={handleInfoWindowClose}
                        >
                            <div>
                                <p>
                                    <span>Address: </span>
                                    {localStorage.getItem("autoSearchAddress")}
                                </p>
                            </div>
                        </InfoWindow>
                    )}
                </AdvancedMarker>
            )}
        </div>
    );
};

export default AutocompleteSearch;