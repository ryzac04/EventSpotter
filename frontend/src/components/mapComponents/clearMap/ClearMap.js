
/**
 * ClearMap Component
 * 
 * Provides a button to clear various map-related data and reset the map state.
 * Clears dropped pin coordinates and address, events, auto-complete marker and coordinates, directions, and associated localStorage items.
 * 
 * @param {Object} props - the component props.
 * @param {function} props.setDroppedPinCoords - function to set the state of the dropped pin coordinates.
 * @param {function} props.setDroppedPinAddress - function to set the state of the dropped pin address.
 * @param {function} props.setEvents - function to set the state of the events data.
 * @param {function} props.setAutoSearchMarker - function to set the state of the auto-complete search marker.
 * @param {function} props.setAutoSearchCoords - function to set the state of the auto-complete search coordinates.
 * @param {function} props.setInfoWindowOpen - function to set the state of InfoWindow visibility.
 * @param {Object} props.directionsRef - reference to the Directions component for clearing directions.
 * @param {boolean} props.buttonsDisabled - indicates whether buttons are disabled.
 * @param {function} props.setError - function to set error state or display an error message.
 * 
 * @returns {JSX.Element} - JSX element - 'Clear Map' button.
 * 
 * This component found in: EventMap.js
 */

const ClearMap = ({
    setDroppedPinCoords,
    setDroppedPinAddress,
    setEvents,
    setAutoSearchMarker,
    setAutoSearchCoords,
    setInfoWindowOpen,
    directionsRef,
    buttonsDisabled,
    setError
}) => {

    const handleClearMap = (e) => {
        e.preventDefault();

        // Close any open info windows 
        setInfoWindowOpen(false);

        // Clear dropped pin and address 
        setDroppedPinCoords(null);
        setDroppedPinAddress("");

        // Clear events
        setEvents([]);

        // Clear auto-complete marker and coords
        setAutoSearchMarker(null);
        setAutoSearchCoords(null);

        // Clear errors 
        setError([]);

        // Clear directions 
        if (directionsRef.current) {
            directionsRef.current.clearDirections();
        }

        // Remove localStorage items
        localStorage.removeItem("droppedPinCoords");
        localStorage.removeItem("droppedPinAddress");
        localStorage.removeItem("events");
        localStorage.removeItem("eventAddress");
        localStorage.removeItem("autoSearchMarker");
        localStorage.removeItem("autoSearchCoords");    
        localStorage.removeItem("autoSearchAddress");    
    };

    return (
        <form>
            <div className="clear-button">
                <button className="btn btn-danger" disabled={buttonsDisabled} onClick={handleClearMap}>Clear Map</button>
            </div>
        </form>
    );
};

export default ClearMap;