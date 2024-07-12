
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { fromLatLng } from "react-geocode";

import Alert from "./common/Alert";
import "./DroppedPin.css";

/**
 * DroppedPin Component
 * 
 * Renders a toggle button to drop a pin on the map, displays the pin and its info when selected.
 * 
 * @param {Object} props - the component props.
 * @param {string|null} props.selectedMarkerId - ID of the currently selected marker.
 * @param {function} props.setSelectedMarkerId - function to set the selected marker ID.
 * @param {Object|null} props.droppedPinCoords - coordinates of the dropped pin.
 * @param {function} props.setDroppedPinCoords - function to set the dropped pin coordinates.
 * @param {string|null} props.droppedPinAddress - address of the dropped pin location.
 * @param {function} props.setDroppedPinAddress - function to set the dropped pin address.
 * @param {boolean} props.buttonsDisabled - flag indicating if buttons are disabled.
 * @param {string|null} props.error - error message related to search functionality.
 * @param {function} props.setError - function to set the search error message.
 * 
 * @returns {JSX.Element} - JSX element representing the dropped pin on the map.
 * 
 * Other components used are from @vis.gl/react-google-maps and react-geocode libraries.
 * Found in: EventMap.js 
 */

const DroppedPin = forwardRef(({
    selectedMarkerId,
    setSelectedMarkerId,
    droppedPinCoords,
    setDroppedPinCoords,
    droppedPinAddress,
    setDroppedPinAddress,
    buttonsDisabled,
    error,
    setError
}, ref) => {
    const [droppedPinActive, setDroppedPinActive] = useState(false);

    const selectByMarkerId = (id) => {
        setSelectedMarkerId(id === selectedMarkerId ? null : id);
    };
    
    const handleDroppedPinToggle = (e) => {
        e.preventDefault();
        setDroppedPinActive(!droppedPinActive);
    };

    useImperativeHandle(ref, () => ({
        handleDroppedPin: (latitude, longitude) => {
            if (droppedPinActive) {
                const location = { lat: latitude, lng: longitude };
                setDroppedPinCoords(location);
                localStorage.setItem("droppedPinCoords", JSON.stringify(location));

                // Reverse Geocode the coordinates
                fromLatLng(latitude, longitude).then(
                    (response) => {
                        const droppedPinAddress = response.results[0].formatted_address;
                        setDroppedPinAddress(droppedPinAddress);
                        localStorage.setItem("droppedPinAddress", droppedPinAddress);
                    },
                    (error) => {
                        console.error("Geocoding error:", error);
                        setError("Failed to retrieve address. Please try again.");
                    }
                );
            }
        },
    }));

    return (
        <div className="DroppedPin">
            <div className="toggle-dropped-pin">
                <button
                    className={`btn btn-light ${droppedPinActive ? "active" : ""}`}
                    disabled={buttonsDisabled}
                    onClick={handleDroppedPinToggle}
                >
                    Drop Pin
                </button>
            </div>
            {droppedPinCoords && (
                <AdvancedMarker
                    key="dropped-pin"
                    position={droppedPinCoords}
                    onClick={() => selectByMarkerId("dropped-pin")}
                >
                    <Pin
                        background={"green"}
                        borderColor={"black"}
                        glyphColor={"black"}
                    />
                    {selectedMarkerId === "dropped-pin" && (
                        <InfoWindow
                            className="info-window"
                            position={droppedPinCoords}>
                            <p><span>Location: </span>{droppedPinAddress}</p>
                        </InfoWindow>
                    )}
                </AdvancedMarker>
            )}
            {error && <Alert type="danger" messages={[error]} />}
        </div>
    );
});

export default DroppedPin;