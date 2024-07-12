
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContext";
import EventSpotterApi from "../../services/api";
import Alert from "../common/Alert";

/**
 * DeleteAccount Component
 * 
 * Delete form for a user who wishes to cancel their account. 
 * 
 * On successful submission, calls the deleteUser API route and redirects to a thank you page for using our services with encouragement to sign up again if the user wishes. 
 * 
 * route: /delete
 * 
 * Other components used: Alert
 */

const DeleteAccount = () => {
    const { currentUser, setCurrentUser } = useAuthContext();
    const [formErrors, setFormErrors] = useState([]);
    const navigate = useNavigate();


    const handleDeleteAccount = async () => {
        try {
            await EventSpotterApi.deleteUser(currentUser.username);
            setCurrentUser(null);
            navigate("/thank-you");     
        } catch (error) {
            console.error("Error deleting user:", error);
            setFormErrors("Failed to delete account. Please try again later.");
        }
    };

    return (
        <div className="DeleteAccount col-md-6 col-lg-4 offset-md-3 offset-lg-4">
            <h3 className="heading-text">Delete Account</h3>
            <div className="card">
                <div className="card-body">

                    <p className="text-danger fw-bold">By pressing the button below, your account will be permanently deleted.</p>
                    <p className="text-danger fw-bold">  This action cannot be undone.</p>

                    <div className="mt-4">
                        <button onClick={handleDeleteAccount} className="btn btn-danger">Delete My Account</button>
                    
                        <Link to="/profile" className="btn btn-secondary float-end">Cancel</Link>
                    </div>

                    <div className="mt-4">
                        {formErrors.length
                            ? <Alert type="danger" messages={formErrors} />
                            : null}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;