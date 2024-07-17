# EventSpotter

EventSpotter is a web application designed to help users discover local events easily. It leverages various APIs and user-friendly features to provide a seamless experience for finding nearby events. 

A user will create an account and visit the EventSpotter Map page. If a user chooses to share their location, the map will mark that location with a blue marker. Next, the user can search for events using the form. Found events will be displayed on the map by venue as a red marker. 

If an event is on the rendered list but there is no venue on the map, the user can search for the venue with the autocomplete address search bar. A found venue using this search bar will be displayed on the map as a yellow marker. 

Selecting a venue on the map will turn the marker a lighter red color and open an info window about the venue, its location, and the corresponding events from the rendered events list. A route from the user's location can be mapped to any selected destination on the map with the Directions button. 

If a user chooses not to share their location, the map can still be used and a custom marker can be placed at any location. This marker will act as the origin instead of the user's location when searching for directions to an event venue on the map. 

## Prerequisites

* Technology Used:
  * React
  * Node.js
  * Express
  * PostgreSQL
  * Axios
  * Bootstrap
  * @vis.gl/react-google-maps
  * Google Maps JavaScript API
  * Ticketmaster Discovery API
* Environment Setup:
  * Frontend dependencies are listed in 'frontend/package.json'. 
  * Backend dependencies are listed in 'backend/package.json'. 

## URLs
* [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
* [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)