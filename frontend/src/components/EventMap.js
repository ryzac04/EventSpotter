
import React, { useState, useEffect, useRef } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { setKey } from "react-geocode";

import PermissionModal from "./PermissionModal";
import UserPin from "./UserPin";
import DroppedPin from "./DroppedPin";
import EventPin from "./EventPin";
import AutocompleteSearch from "./AutocompleteSearch";
import Directions from "./Directions";
import EventFilterForm from "./EventFilterForm";
import EventList from "./EventList";

import "./EventMap.css";

// Set Google Maps API Key - needed for "react-geocode"
setKey(process.env.REACT_APP_GMAP_API_KEY);

// Default Map Settings
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // center of contiguous 48 states in USA
const DEFAULT_ZOOM_DENIED = 3;

const EventMap = () => {

    // State 
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM_DENIED);
    const [userCoords, setUserCoords] = useState(null);
    const [userAddress, setUserAddress] = useState("");
    const [droppedPinCoords, setDroppedPinCoords] = useState(null);
    const [droppedPinAddress, setDroppedPinAddress] = useState("");
    const [events, setEvents] = useState([]);
    const [autoSearchMarker, setAutoSearchMarker] = useState(null);
    const [autoSearchCoords, setAutoSearchCoords] = useState(null);
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [error, setError] = useState(null);


    // Refs
    const droppedPinRef = useRef();
    const directionsRef = useRef();

    // Save state to localStorage on state change
    useEffect(() => {
        localStorage.setItem("mapCenter", JSON.stringify(mapCenter));
        localStorage.setItem("mapZoom", JSON.stringify(mapZoom));
    }, [mapCenter, mapZoom])

    // Handlers
    const handleMapChange = (event) => {
        setMapCenter(event.detail.center);
        setMapZoom(event.detail.zoom);
    };

    const handleMapClick = (e) => {
        const latitude = e.detail.latLng.lat;
        const longitude = e.detail.latLng.lng;
        if (droppedPinRef.current) {
            droppedPinRef.current.handleDroppedPin(latitude, longitude);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <PermissionModal
                setMapCenter={setMapCenter}
                setMapZoom={setMapZoom}
                setUserCoords={setUserCoords}
                setUserAddress={setUserAddress}
                setButtonsDisabled={setButtonsDisabled}
            />
            <APIProvider
                apiKey={process.env.REACT_APP_GMAP_API_KEY}
                libraries={["places", "geometry", "drawing", "visualization", "routes"]}
            >
                <div className="map-container">
                    <Map
                        mapId={process.env.REACT_APP_GMAP_MAP_ID}
                        center={mapCenter}
                        zoom={mapZoom}
                        onCameraChanged={handleMapChange}
                        onClick={handleMapClick}
                        options={{
                            scaleControl: true,
                        }}
                    >
                        <UserPin
                            selectedMarkerId={selectedMarkerId}
                            setSelectedMarkerId={setSelectedMarkerId}
                            userCoords={userCoords}
                            userAddress={userAddress}
                        />
                        <DroppedPin
                            ref={droppedPinRef}
                            selectedMarkerId={selectedMarkerId}
                            setSelectedMarkerId={setSelectedMarkerId}
                            droppedPinCoords={droppedPinCoords}
                            setDroppedPinCoords={setDroppedPinCoords}
                            droppedPinAddress={droppedPinAddress}
                            setDroppedPinAddress={setDroppedPinAddress}
                            buttonsDisabled={buttonsDisabled}
                        />
                        <AutocompleteSearch
                            selectedMarkerId={selectedMarkerId}
                            setSelectedMarkerId={setSelectedMarkerId}
                            setInfoWindowOpen={setInfoWindowOpen}
                            autoSearchMarker={autoSearchMarker}
                            setAutoSearchMarker={setAutoSearchMarker}
                            autoSearchCoords={autoSearchCoords}
                            setAutoSearchCoords={setAutoSearchCoords}
                            buttonsDisabled={buttonsDisabled}
                        />
                        <Directions
                            ref={directionsRef}
                        />
                    </Map>
                    <EventFilterForm
                        setEvents={setEvents}
                        userCoords={userCoords}
                        droppedPinCoords={droppedPinCoords}
                        mapCenter={mapCenter}
                        buttonsDisabled={buttonsDisabled}
                        error={error}
                        setError={setError}
                    />
                    <EventList events={events} />
                </div>
            </APIProvider>
        </div>
    );
};

export default EventMap;