
/** Utility functions used throughout the app. */

// Format date to ISO string - used in useEndDateTime.js
const formatDateToISO = (date) => {
    if (!date) return null;
    return date.toISOString().split('.')[0] + 'Z';
};

// Formatting options for .toLocaleString() - used in EventMap.js and Event.js
const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric"
};

// Groups filtered events by venue id - used in EventPin.js
const groupEventsByVenue = (events) => {
    return events.reduce((acc, event) => {
        const venueId = event._embedded.venues[0].id;
        if (!acc[venueId]) {
            acc[venueId] = {
                venue: event._embedded.venues[0],
                events: [],
            };
        }
        acc[venueId].events.push(event);
        return acc;
    }, {});
};

export { formatDateToISO, options, groupEventsByVenue };