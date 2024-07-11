                      
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import "./EventMap.css";

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