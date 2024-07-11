
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuthContext } from "../../contexts/authContext";
import Alert from "../common/Alert";

/**
 * Profile Component 
 * 
 * Form to edit profile details: email and password.
 * 
 * Displays profile form and handles changes to form state. Submitting the form calls the API to save, and triggers user reloading throughout the site. 
 * Also displays delete button that will bring user to account deletion form.
 * 
 * route: /profile
 * 
 * Other components used: Alert
 */

const Profile = ({ updateUser }) => {
    const { currentUser } = useAuthContext();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [formErrors, setFormErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [noChangesMessage, setNoChangeMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username || "",
                email: currentUser.email || "",
                password: "",
                confirmPassword: ""
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(formData => ({ ...formData, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors([]);
        setSuccessMessage("");
        setNoChangeMessage("");

        // Check password confirmation
        if (formData.password && formData.password !== formData.confirmPassword) {
            setFormErrors(["Passwords do not match"]);
            return;
        }

        // Determine if any changes have been made
        const usernameChanged = formData.username && formData.username !== currentUser.username;
        const emailChanged = formData.email && formData.email !== currentUser.email;
        const passwordChanged = formData.password && formData.password !== "";

        // Check if there are no changes
        if (!usernameChanged && !emailChanged && !passwordChanged) {
            setNoChangeMessage("No changes were made to the profile.");
            return;
        }

        // Construct the data to send, only including fields that have changed
        const dataToUpdate = {};
        if (usernameChanged) dataToUpdate.username = formData.username;
        if (emailChanged) dataToUpdate.email = formData.email;
        if (passwordChanged) dataToUpdate.password = formData.password;

        try {
            const result = await updateUser(currentUser.username, dataToUpdate);

            if (result.success) {
                setSuccessMessage("Profile updated successfully");
                navigate("/profile");
            } else {
                setFormErrors(result.error)
            }
        } catch (error) {
            console.error("Error during user update:", error);
        }
    }

    return (
        <div className=" ProfileForm col-md-6 col-lg-4 offset-md-3 offset-lg-4">
            <h3 className="heading-text">Profile</h3>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-2">
                            <label className="form-label" htmlFor="username">Username</label>
                            <input
                                disabled
                                className="form-control"
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                placeholder={formData.username}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                className="form-control"
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                placeholder={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                className="form-control"
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                placeholder="Enter new password (optional)."
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                placeholder="Confirm new password."
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div>
                            <button className="btn btn-primary mt-4">Save Changes</button>

                            <Link className="btn btn-danger mt-4 float-end"
                                to="/delete">
                                Delete Account
                            </Link>
                        </div>

                        <div className="form-group mt-4">
                            {formErrors.length
                                ? <Alert type="danger" messages={formErrors} />
                                : null}
                        
                            {successMessage && (
                                <Alert type="success" messages={[successMessage]} />)}
                            
                            {noChangesMessage && (
                                <Alert type="info" messages={[noChangesMessage]} />)}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;