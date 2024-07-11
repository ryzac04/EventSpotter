                      
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import "./EventMap.css";

/**
 * UserPin Component
 * 
 * Renders a marker on the map to indicate the user's location. When the marker is clicked, it toggles the display of an InfoWindow showing the user's address. 
 * 
 * @param {Object} props - The component props.
 * @param {string} props.selectedMarkerId - the ID of the currently selected marker.
 * @param {function} props.setSelectedMarkerId - function to set the selected marker ID.
 * @param {Object} props.userCoords - the coordinates of the user's location.
 * @param {number} props.userCoords.lat - the latitude of the user's location.
 * @param {number} props.userCoords.lng - the longitude of the user's location.
 * @param {string} props.userAddress - the address corresponding to the user's location.
 *
 * @returns {JSX.Element} - JSX element representing the user's location marker on the map.
 * 
 * Other components used are from '@vis.gl/react-google-maps' library.
 * Found in: EventMap.js 
 */

const UserPin = ({
    selectedMarkerId,
    setSelectedMarkerId,
    userCoords,
    userAddress
}) => {
    const selectByMarkerId = (id) => {
        setSelectedMarkerId(id === selectedMarkerId ? null : id);
    };
    return (
        <div>
            {userCoords &&
                <AdvancedMarker
                    key="user-location"
                    position={userCoords}
                    onClick={() => selectByMarkerId("user-location")}
                >
                    <Pin
                        background={"blue"}
                        borderColor={"black"}
                        glyphColor={"black"}
                    />
                    {selectedMarkerId === "user-location" && (
                        <InfoWindow
                            className="info-window"
                            position={userCoords}>
                            <p><span>My Location: </span>{userAddress}</p>
                        </InfoWindow>
                    )}
                </AdvancedMarker>
            }
        </div>
    );
};

export default UserPin;