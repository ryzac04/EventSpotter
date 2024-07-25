
import { options } from "../../../utils/appUtils";

/**
 * Event Component
 * 
 * Renders a card that contains an event including its name, address, venue, description, date/time, price, and link to purchase tickets. 
 * Displays "Unavailable" for any information that is present. 
 * 
 * @param {Object} props - the component props.
 * @param {Object} props.event - event object containing various information about the event. 
 *
 * @returns {JSX.Element} - JSX element representing the singular event. 
 * 
 * Utility function used: options 
 * This component found in: EventList.js
 */

const Event = ({ event }) => {
    const venue = event._embedded?.venues[0];
    const classifications = event.classifications?.[0];

    const address = `${venue.address.line1 || "Unavailable"}, 
                    ${venue.city?.name || ""}, 
                    ${venue.state?.stateCode || ""}, 
                    ${venue.postalCode || ""}`;
    
    const description = event.info || (classifications ?
        `${classifications.segment.name}${classifications.genre ? `, ${classifications.genre.name}` : ''}${classifications.subGenre ? `, ${classifications.subGenre.name}` : ''}`
        : 'Unavailable');
    
    const dateTime = event.dates.start.dateTime ?
        new Date(event.dates.start.dateTime).toLocaleString() :
        (event.dates.start.localDate ?
            new Date(event.dates.start.localDate).toLocaleString("en-us", options) :
            "Unavailable"
        );
    
    const price = event.priceRanges && event.priceRanges.length > 0
        && event.priceRanges[0].min !== undefined
        && event.priceRanges[0].max !== undefined ?
        `$${(event.priceRanges[0].min).toFixed(2)}-$${(event.priceRanges[0].max).toFixed(2)}`
        : "For current prices, please visit the link or check the vendor's official site.";
        
    return (
        <div key={event.id} className="Event">
            <div className="card mb-2">
                <div className="card-body">
                    <h5 className="card-title">{event.name}</h5>
                    <ul className="list-group list-group-flush">

                    {venue && (
                    <li className="list-group-item"><strong>Address: </strong>{address}</li>
                    )}
                    <li className="list-group-item"><strong>Venue: </strong>{venue.name || "Unavailable"}</li>
                    <li className="list-group-item"><strong>Description: </strong>{description}</li>
                    <li className="list-group-item"><strong>Date/Time: </strong>{dateTime}</li>
                    <li className="list-group-item"><strong>Price: </strong>{price}</li>
                    <a className="list-group-item list-group-item-action active text-center" href={event.url} target="_blank" rel="noopener noreferrer">Purchase Tickets</a>
                    </ul>
                        
                </div>
            </div>
        </div>        
    );
};

export default Event;