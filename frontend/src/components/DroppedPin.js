
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { fromLatLng } from "react-geocode";

import "./DroppedPin.css";

/**
 * DroppedPin Component
 * 
 * Renders a toggle button to drop a pin on the map. 
 * Clicking on the map renders a marker indicating the dropped pin location. 
 * When the marker is clicked, it toggles the display of an InfoWindow showing the dropped pin's location.
 * 
 * @param {Object} props - the component props.
 * @param {string|null} props.selectedMarkerId - the ID of the currently selected marker.
 * @param {function} props.setSelectedMarkerId - function to set the selected marker ID.
 * @param {Object|null} props.droppedPinCoords - the coordinates of the dropped pin.
 * @param {function} props.setDroppedPinCoords - function to set the state of the dropped pin coordinates.
 * @param {string|null} props.droppedPinAddress - the address of the dropped pin location.
 * @param {function} props.setDroppedPinAddress - function to set the state of the dropped pin address.
 * @param {boolean} props.buttonsDisabled - indicates whether buttons are disabled.
 * @param {function} props.setError - function to set error state or display an error message.
 * 
 * @returns {JSX.Element} - JSX element representing 'Drop Pin' toggle button and the dropped pin marker on the map.
 * 
 * Uses fromLatLng from react-geocode for reverse geocoding.
 * Other components used are from @vis.gl/react-google-maps library.
 * This component found in: EventMap.js 
 */

const DroppedPin = forwardRef(({
    selectedMarkerId,
    setSelectedMarkerId,
    droppedPinCoords,
    setDroppedPinCoords,
    droppedPinAddress,
    setDroppedPinAddress,
    buttonsDisabled,
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
                        setError("Error retrieving dropped pin location. Please try again.");
                    }
                );
            }
        },
    }));

    return (
        <div className="DroppedPin">
            <div className="toggle-dropped-pin">
                <button
                    className={`btn btn-secondary ${droppedPinActive ? "active" : ""}`}
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
        </div>
    );
});

export default DroppedPin;