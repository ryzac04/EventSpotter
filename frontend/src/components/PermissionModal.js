
import React, { useState, useEffect } from "react";
import { setKey, fromLatLng } from "react-geocode";
import { useAuthContext } from "../contexts/authContext";

import Alert from "./common/Alert";
import "./EventMap.css";

// Set Google Maps API Key - needed for "react-geocode"
setKey(process.env.REACT_APP_GMAP_API_KEY);

// Default Map Settings
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // center of contiguous 48 states in USA - fun fact!
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
            handleLocationPermssion();
        }

    }, [currentUser]);

    const handleLocationPermssion = () => {
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
    }

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
                        <p>EventSpotter would like to use your location to show nearby events. Do you give permission to access your location?</p>
                        <button onClick={handleAllowLocation}>Allow</button>
                        <button onClick={handleDenyLocation}>Deny</button>
                    </div>
                )}
        </div>

    );
};

export default PermissionModal;