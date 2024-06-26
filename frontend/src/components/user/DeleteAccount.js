
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuthContext } from "../../contexts/authContext";
import Alert from "../common/Alert";
import EventSpotterApi from "../../services/api";

const DeleteAccount = () => {
    const { currentUser, setCurrentUser } = useAuthContext();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [formError, setFormError] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(formData => ({ ...formData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormError([]);

        // Check password confirmation
        if (formData.password && formData.password !== formData.confirmPassword) {
            setFormError(["Passwords do not match"]);
            return;
        }

        try {

            await EventSpotterApi.deleteUser(currentUser.username);
            setCurrentUser(null);
            navigate("/");
        
        } catch (error) {
            console.error("Error deleting user:", error);
            setFormError("Failed to delete account. Please try again later.");
        }
    };

    return (
        <div className="DeleteAccount col-md-6 col-lg-4 offset-md-3 offset-lg-4">
            <h3>Delete Account</h3>
            <div className="card">
                <div className="card-body">
                    {formError && <Alert type="danger" messages={[formError]} />}

                    <p className="text-danger">This action is irreversible. Are you sure you want to delete your account?</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-danger mr-2">Delete Account</button>
                        <Link to="/profile" className="btn btn-secondary">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;