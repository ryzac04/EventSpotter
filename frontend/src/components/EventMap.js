
import React, { useState, useEffect } from "react";
import { APIProvider, Map, } from "@vis.gl/react-google-maps";
import { setKey } from "react-geocode";

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
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

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
                        
                    </Map>
                    <EventPin
                        selectedMarkerId={selectedMarkerId}
                        setSelectedMarkerId={setSelectedMarkerId}
                        setInfoWindowOpen={setInfoWindowOpen}
                        events={events}
                    />
                    <EventFilterForm
                        setEvents={setEvents}
                        userCoords={userCoords}
                        droppedPinCoords={droppedPinCoords}
                        mapCenter={mapCenter}
                        buttonsDisabled={buttonsDisabled}
                    />
                </div>
            </APIProvider>
        </div>
    );
};

export default EventMap;