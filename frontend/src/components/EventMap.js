
import React, { useState, useEffect, useRef, useContext } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { setKey } from "react-geocode";

import { MessageContext } from "../contexts/MessageContext";

import PermissionModal from "./PermissionModal";
import UserPin from "./UserPin";
import DroppedPin from "./DroppedPin";
import EventPin from "./EventPin";
import AutocompleteSearch from "./AutocompleteSearch";
import Directions from "./Directions";
import LocationDisplay from "./LocationDisplay";
import EventFilterForm from "./EventFilterForm";
import EventList from "./EventList";
import ClearMap from "./ClearMap";
import Alert from "./common/Alert";

import "./EventMap.css";

/**
 * EventMap Component
 * 
 * Integrates a Google Maps interface for displaying events and managing user interactions.
 * Manages map center, zoom level, user and event coordinates, and interacts with various map components.
 * Uses localStorage for persistent state and handles error messages through context.
 * 
 * @returns {JSX.Element} JSX element representing the EventMap component.
 * 
 * Other components used are from @vis.gl/react-google-maps library.
 */

// Set Google Maps API Key - needed for "react-geocode"
setKey(process.env.REACT_APP_GMAP_API_KEY);

// Default Map Settings
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // center of contiguous 48 states in USA
const DEFAULT_ZOOM_DENIED = 3;

const EventMap = () => {
    const { setError, clearError, clearSuccess, clearInfo } = useContext(MessageContext);

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

    // Refs
    const droppedPinRef = useRef();
    const directionsRef = useRef();

    // Load state from localStorage on component mount - maintains venue pins and event list through page refresh; also clears error messages
    useEffect(() => {
        const storedDroppedPinCoords = JSON.parse(localStorage.getItem("droppedPinCoords"));
        const storedAutoSearchMarker = JSON.parse(localStorage.getItem("autoSearchMarker"));
        const storedEvents = JSON.parse(localStorage.getItem("events"));

        setDroppedPinCoords(storedDroppedPinCoords);
        setAutoSearchMarker(storedAutoSearchMarker);
        if (storedEvents) { setEvents(storedEvents) }; // upon first mount, there will be no storedEvents

        clearError();
        clearSuccess();
        clearInfo();
    }, []);

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
        <div className="container-fluid">
            <h1 className="map-heading">EventSpotter Map</h1>
            <PermissionModal
                setMapCenter={setMapCenter}
                setMapZoom={setMapZoom}
                setUserCoords={setUserCoords}
                setUserAddress={setUserAddress}
                setButtonsDisabled={setButtonsDisabled}
                setError={setError}
            />
            <APIProvider
                apiKey={process.env.REACT_APP_GMAP_API_KEY}
                libraries={["places", "geometry", "drawing", "visualization", "routes"]}
            >
                <div className="row">
                    <div className="col-12">
                        <div className="location-display-container">
                            <LocationDisplay
                                userAddress={userAddress}
                                droppedPinAddress={droppedPinAddress}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
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
                                    setError={setError}
                                />
                                <EventPin
                                    selectedMarkerId={selectedMarkerId}
                                    setSelectedMarkerId={setSelectedMarkerId}
                                    setInfoWindowOpen={setInfoWindowOpen}
                                    events={events}
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
                                    setError={setError}
                                />
                                <Directions
                                    ref={directionsRef}
                                    setError={setError}
                                />
                                <ClearMap
                                    setDroppedPinCoords={setDroppedPinCoords}
                                    setDroppedPinAddress={setDroppedPinAddress}
                                    setEvents={setEvents}
                                    setAutoSearchMarker={setAutoSearchMarker}
                                    setAutoSearchCoords={setAutoSearchCoords}
                                    setInfoWindowOpen={setInfoWindowOpen}
                                    directionsRef={directionsRef}
                                    buttonsDisabled={buttonsDisabled}
                                    setError={setError}
                                />
                            </Map>
                        </div>
                    </div>
                </div>
                <div className="alert-container">
                    <Alert />
                </div>
                <div className="event-section mt-4">
                    <EventFilterForm
                        setEvents={setEvents}
                        userCoords={userCoords}
                        droppedPinCoords={droppedPinCoords}
                        mapCenter={mapCenter}
                        buttonsDisabled={buttonsDisabled}
                        setError={setError}
                    />
                    <EventList events={events} />
                </div>
            </APIProvider>
        </div>
    );
};

export default EventMap;