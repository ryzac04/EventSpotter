
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
 * @param {string} props.selectedMarkerId - ID of the currently selected marker.
 * @param {function} props.setSelectedMarkerId - function to set the selected marker ID.
 * @param {function} props.setInfoWindowOpen - function to control the state of the info window.
 * @param {Object} props.autoSearchMarker - marker object for the auto-complete search result.
 * @param {function} props.setAutoSearchMarker - function to set the auto-complete search marker.
 * @param {boolean} props.buttonsDisabled - indicates whether buttons should be disabled.
 * 
 * @returns {JSX.Element} - JSX element representing the AutocompleteSearch component.
 * 
 * Custom hooks used: useMap
 * Other components used: AdvancedMarker, Pin, InfoWindow
 * Other components used are from @vis.gl/react-google-maps and react-geocode libraries.
 * 
 * Found in: EventMap.js
 */

const AutocompleteSearch = ({
    selectedMarkerId,
    setSelectedMarkerId,
    setInfoWindowOpen,
    autoSearchMarker,
    setAutoSearchMarker,
    buttonsDisabled
}) => {
    const map = useMap();
    
    const [autocomplete, setAutocomplete] = useState(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setupAutocomplete();
    }, []);

    const handleLocationSelect = (e) => {
        e.preventDefault();
        if (!autocomplete || !map) return;
        const place = autocomplete.getPlace();

        if (!inputValue || !place.geometry || !place.formatted_address) {
            setInputValue("");
            return;
        }

        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        const location = { lat: latitude, lng: longitude };
        // Store location in localStorage
        localStorage.setItem("autoSearchCoords", JSON.stringify(location));
        
        // Reverse Geocode the coordinates
        fromLatLng(latitude, longitude).then(
            (response) => {
                const autoSearchAddress = response.results[0].formatted_address;
                localStorage.setItem("autoSearchAddress", autoSearchAddress);
            },
            (error) => {
                console.error("Geocoding error:", error);
            }
        );

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

    return (
        <div className="autocomplete-container">
            <form onSubmit={handleLocationSelect}>
            <input
                id="autocomplete"
                className="autocomplete-input"
                type="text"
                placeholder="Enter address"
                value={inputValue}
                onChange={handleChange}
            />
            <button className="autocomplete-button" type="submit" disabled={buttonsDisabled}>Search</button>
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