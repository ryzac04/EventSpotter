
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

/**
 * Directions Component
 * 
 * Renders a button to fetch and display driving directions on a Google Map.
 * Utilizes the Google Maps Directions Service and Directions Renderer.
 *
 * @returns {JSX.Element} - JSX element representing the Directions component.
 * 
 * Other components used: Alert
 * Custom hooks used: useMap, useMapsLibrary
 * Functions exposed through ref:
 * - clearDirections: Clears the current directions and resets the component state.
 * Found in EventMap.js
 */

const Directions = forwardRef((props, ref) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");

    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const [directionsRequested, setDirectionsRequested] = useState(false);

    // Initialize directions services
    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));

    }, [routesLibrary, map, setRoutes]);

    // Update the route index in the directions renderer
    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    // Fetch directions when services are ready - maintains route through refresh
    useEffect(() => {
        if (!directionsService || !directionsRenderer || !directionsRequested) return;
        getDirections()
        setDirectionsRequested(false);
    }, [directionsService, directionsRenderer, directionsRequested]);

    useEffect(() => {
        const persistedDirections = localStorage.getItem("directions");
        if (persistedDirections) {
            const parsedDirections = JSON.parse(persistedDirections);
            if (directionsRenderer && parsedDirections) {
                directionsRenderer.setDirections(parsedDirections);
                setRoutes(parsedDirections.routes);
            }
        }
    }, [directionsRenderer]);

    // Expose clearDirections function through ref for EventMap.js
    useImperativeHandle(ref, () => ({
        clearDirections: () => {
            if (directionsRenderer) {
                directionsRenderer.setDirections({ routes: [] });
                setRoutes([]);
                setDirectionsRequested(false);
                localStorage.removeItem("directions");
            }
        }
    }));

    // Function to get directions - called by useEffect above
    const getDirections = () => {
        const origin = localStorage.getItem("userAddress") || localStorage.getItem("droppedPinAddress");
        const destination = localStorage.getItem("eventAddress") || localStorage.getItem("autoSearchAddress");

        if (!origin || !destination) {
            return;
        }

        directionsService.route({
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
        }).then(response => {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
            localStorage.setItem("directions", JSON.stringify(response));
        }).catch(error => {
            console.error("Directions request failed:", error);
        });
    };

    const handleGetDirections = () => {
        setDirectionsRequested(true);
    };

    const userAddress = localStorage.getItem("userAddress");
    const droppedPinAddress = localStorage.getItem("droppedPinAddress");
    const eventAddress = localStorage.getItem("eventAddress");
    const autoSearchAddress = localStorage.getItem("autoSearchAddress");

    return (
        <div className="directions">
            {(userAddress || droppedPinAddress) && (eventAddress || autoSearchAddress) ? (
                <button className="btn btn-secondary" onClick={handleGetDirections}>Get Directions</button>
            ) : (
                <button className="btn btn-secondary" disabled>Get Directions</button>
            )}
        </div>
    );
});

export default Directions;