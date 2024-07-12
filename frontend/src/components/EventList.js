
import Event from "./Event";

/**
 * EventList Component
 * 
 * Renders list of all individual events - individual event rendered by Event.js 
 * 
 * @returns {JSX.Element} - JSX element representing the event list.
 */

const EventList = ({ events }) => {
    return (
        <div className="EventList col-md-8 offset-md-2">
            {events.map(event => (
                <Event key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventList;