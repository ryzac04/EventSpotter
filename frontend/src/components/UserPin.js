                      
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import "./EventMap.css";

/**
 * UserPin Component
 * 
 * Renders a marker on the map to indicate the user's location. When the marker is clicked, it toggles the display of an InfoWindow showing the user's address. 
 * 
 * Props passed from EventMap.js:
 *  - selectedMarkerId
 *  - setSelectedMarkerId
 *  - userCoords
 *  - userAddress
 * 
 * Other components used are from '@vis.gl/react-google-maps' library.
 * 
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