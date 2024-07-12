
import Event from "./Event";

/**
 * EventList Component
 * 
 * Renders list of all individual events - individual event rendered by Event.js 
 * 
 * @returns {JSX.Element} - JSX element representing the event list.
 * 
 * This component found in: EventMap.js
 */

const EventList = ({ events }) => {
    return (
        <div className="EventList">
            {events && events.length > 0 ? <h3 className="heading-text">Event List</h3> : ""}
            {events.map(event => (
                <Event key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventList;