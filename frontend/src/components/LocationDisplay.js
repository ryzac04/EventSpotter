
import React from 'react';
import "./EventMap.css"

/**
 * LocationDisplay Component
 * 
 * Displays addresses related to user location, dropped pin, and destination.
 * If available, shows the user's address or the dropped pin's address.
 * Also displays the destination address stored in localStorage.
 * 
 * @component
 * @param {Object} props - the component props.
 * @param {string} props.userAddress - the user's address to display.
 * @param {string} props.droppedPinAddress - the dropped pin's address to display.
 * 
 * @returns {JSX.Element} - JSX element representing the location display information.
 * 
 * Found in: EventMap.js
 */

const LocationDisplay = ({ userAddress, droppedPinAddress }) => {
    return (
        <div className="container mt-3">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            {userAddress ? (
                                <p className="card-text">
                                    <strong>Your Address:</strong> {userAddress}
                                </p>
                            ) : (
                                <p className="card-text">
                                    <strong>Dropped Pin Address:</strong> {droppedPinAddress || "No pin dropped."}
                                </p>
                            )}
                        </div>
                        <div className="col-md-6">
                            <p className="card-text text-end">
                                <strong>Destination Address:</strong> {localStorage.getItem("eventAddress") || "No destination selected."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationDisplay;