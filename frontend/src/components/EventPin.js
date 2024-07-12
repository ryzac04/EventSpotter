
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { groupEventsByVenue, options } from "../utils/appUtils";
import "./EventMap.css";

/**
 * EventPin Component
 * 
 * Renders a marker on the map to indicate an event venue's location. When the marker is clicked, it toggles the display of an InfoWindow with details about the venue and events. 
 * 
 * @param {Object} props - the component props.
 * @param {string} props.selectedMarkerId - the ID of the currently selected marker.
 * @param {function} props.setSelectedMarkerId - function to set the selected marker ID.
 * @param {function} props.setInfoWindowOpen - function to set the state of InfoWindow visibility.
 * @param {Array} props.events - array of event objects to be displayed on the map.
 *
 * @returns {JSX.Element} - JSX element representing event markers on the map.
 * 
 * Other components used are from '@vis.gl/react-google-maps' library.
 * Found in: EventMap.js 
 */

const EventPin = ({
    selectedMarkerId,
    setSelectedMarkerId,
    setInfoWindowOpen,
    events
}) => {
    const groupedEvents = groupEventsByVenue(events);

    const handleEventMarkerClick = (group, id) => {
        // Format event location to address string
        const venue = group.venue;
        const addressLine1 = venue.address?.line1 || "Address Unavailable";
        const cityName = venue.city?.name || "City Unavailable";
        const stateCode = venue.state?.stateCode || "State Unavailable";
        const postalCode = venue.postalCode || "Postal Code Unavailable";

        const eventAddress = `${addressLine1}, ${cityName}, ${stateCode}, ${postalCode}`;

        localStorage.removeItem("eventAddress");
        localStorage.setItem("eventAddress", eventAddress);

        setSelectedMarkerId(id === selectedMarkerId ? null : id);
        setInfoWindowOpen(true);
    };

    const handleInfoWindowClose = () => {
        setInfoWindowOpen(false);
    };

    return (
        <div>
            {Object.values(groupedEvents).map((group) => {
                const { venue, events } = group;
                const { latitude, longitude } = venue.location;
                return (
                    <AdvancedMarker
                        key={venue.id}
                        position={{
                            lat: parseFloat(latitude),
                            lng: parseFloat(longitude)
                        }}
                        onClick={() => handleEventMarkerClick(group, venue.id)}
                    >
                        <Pin
                            className={selectedMarkerId === group.venue.id ? "selected-pin" : "pin"}
                            background={selectedMarkerId === group.venue.id ? "tomato" : "red"}
                            borderColor={"black"}
                            glyphColor={"black"}
                        />
                        {selectedMarkerId === venue.id && (
                            <InfoWindow
                                className="info-window"
                                position={{
                                    lat: parseFloat(latitude),
                                    lng: parseFloat(longitude)
                                }}
                                onCloseClick={handleInfoWindowClose}
                            >
                                <div>
                                    <p>
                                        <span>Address: </span>
                                        {venue.address.line1 || "Unavailable"},
                                        {venue.city && venue.city.name || ""},
                                        {venue.state && venue.state.stateCode || ""},
                                        {venue.postalCode || ""}
                                    </p>
                                    <p><span>Venue: </span>{
                                        venue.name || "Unavailable"}
                                    </p>
                                    <span>Events:</span>
                                    <ul>
                                        {events.map((event) => (
                                            <li key={event.id}>
                                                {event.name} {new Date(event.dates.start.localDate).toLocaleString("en-US", options)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </InfoWindow>
                        )}
                    </AdvancedMarker>
                )
            })}
        </div>
    );
};

export default EventPin;