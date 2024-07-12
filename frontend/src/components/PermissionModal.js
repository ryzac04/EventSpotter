
import React, { useState, useEffect } from "react";
import { fromLatLng } from "react-geocode";
import { useAuthContext } from "../contexts/authContext";

import "./PermissionModal.css";

/**
 * PermissionModal Component
 * 
 * Handles user permission for accessing location to show nearby events.
 * If user grants permission, updates user coordinates, address, and updates map settings.
 * If user denies permission or geolocation is not supported, defaults to the specified map center and zoom.
 * 
 * @param {Object} props - the component props.
 * @param {function} props.setMapCenter - function to set the map center coordinates.
 * @param {function} props.setMapZoom - function to set the map zoom level.
 * @param {function} props.setUserCoords - function to set the user's coordinates.
 * @param {function} props.setUserAddress - function to set the user's address.
 * @param {function} props.setButtonsDisabled - function to set the disabled state of buttons during modal display.
 * 
 * @returns {JSX.Element} - JSX element representing the modal for location permission.
 * 
 * Uses fromLatLng from react-geocode for reverse geocoding.
 * Found in: EventMap.js
 */

// Default Map Settings
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // center of contiguous 48 states in USA - just a fun fact!
const DEFAULT_ZOOM_DENIED = 3;
const DEFAULT_ZOOM_GRANTED = 9;

const PermissionModal = ({
    setMapCenter,
    setMapZoom,
    setUserCoords,
    setUserAddress,
    setButtonsDisabled
}) => {
    const { currentUser } = useAuthContext();

    const [showCustomModal, setShowCustomModal] = useState(false);

    useEffect(() => {
        // Check if user location is stored in localStorage
        const storedCoords = localStorage.getItem("userCoords");
        if (storedCoords) {
            const { lat, lng } = JSON.parse(storedCoords);
            setUserCoords({ lat, lng });
            setMapCenter({ lat, lng });
            setMapZoom(DEFAULT_ZOOM_GRANTED);
            fromLatLng(lat, lng).then(
                (response) => {
                    const userAddress = response.results[0].formatted_address;
                    setUserAddress(userAddress);
                },
                (error) => {
                    console.error("Geocoding error:", error);
                }
            );
        } else if (currentUser) {
            handlePermissionAsked();
        }

    }, [currentUser]);

    const handlePermissionAsked = () => {
        if (navigator.geolocation) {
            // Check if the user has already been asked for location permission
            const locationPermissionAsked = localStorage.getItem("locationPermissionAsked");

            // Ask for user's permission to access location
            if (currentUser && locationPermissionAsked !== "true") {
                setShowCustomModal(true);
                setButtonsDisabled(true); // Disable search button when modal is shown
            } else if (locationPermissionAsked === "true") {
                setMapCenter(DEFAULT_CENTER);
                setMapZoom(DEFAULT_ZOOM_DENIED);
            }
        } else {
            console.error("Geolocation is not supported by this browser.");
            setMapCenter(DEFAULT_CENTER);
            setMapZoom(DEFAULT_ZOOM_DENIED);
        }
    };

    const handleAllowLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const location = { lat: latitude, lng: longitude };
                setUserCoords(location);
                setMapCenter(location);
                setMapZoom(DEFAULT_ZOOM_GRANTED);

                // Store location in localStorage
                localStorage.setItem("userCoords", JSON.stringify(location));

                // Reverse Geocode the coordinates
                fromLatLng(latitude, longitude).then(
                    (response) => {
                        const userAddress = response.results[0].formatted_address;
                        setUserAddress(userAddress);
                        localStorage.setItem("userAddress", userAddress);
                    },
                    (error) => {
                        console.error("Geocoding error:", error);
                    }
                );
            },
            (error) => {
                console.error("Permission denied or position unavailable.", error);
                setMapCenter(DEFAULT_CENTER);
                setMapZoom(DEFAULT_ZOOM_DENIED);
            },
            {
                timeout: 10000,
                maximumAge: 0,
                enableHighAccuracy: true,
            }
        );
        localStorage.setItem("locationPermissionAsked", "true");
        setShowCustomModal(false);
        setButtonsDisabled(false); // Re-enable buttons after handling location permission
    };

    const handleDenyLocation = () => {
        setMapCenter(DEFAULT_CENTER);
        setMapZoom(DEFAULT_ZOOM_DENIED);

        localStorage.setItem("locationPermissionAsked", "true");
        setShowCustomModal(false);
        setButtonsDisabled(false); // Re-enable buttons after handling location permission
    };

    return (
        <div>
            {
                showCustomModal && (
                    <div className="custom-modal">
                        <h5></h5>
                        <p>EventSpotter would like to use your location to show nearby events. Do you give permission to access your location?</p>
                        <button className="btn btn-primary" onClick={handleAllowLocation}>Allow</button>
                        <button className="btn btn-danger float-end" onClick={handleDenyLocation}>Deny</button>
                    </div>
                )}
        </div>
    );
};

export default PermissionModal;