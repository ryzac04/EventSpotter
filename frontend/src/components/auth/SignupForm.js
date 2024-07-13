
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContext";
import { ErrorContext } from "../../contexts/ErrorContext";
import Alert from "../common/Alert";

/**
 * SignupForm Component
 * 
 * Renders a signup form for new users to register with EventSpotter.
 * It handles form submission, user input changes, and manages error messages.
 * 
 * On successful submission, it calls the signup function from the AuthContext and redirects to the Home page ("/").
 * If an error occurs during signup, it sets the error message in the ErrorContext.
 * 
 * route: /signup
 * 
 * Other components used: Alert
 */

const SignupForm = () => {
    const { signup } = useAuthContext();
    const { setError, clearError } = useContext(ErrorContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
    });

    useEffect(() => {
        clearError();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await signup(formData);
            if (result.success) {
                localStorage.setItem("locationPermissionAsked", "false");
                navigate("/");
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error("Error during signup:", error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    };

    return (
        <div className="SignupForm">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="heading-text">Sign Up</h2>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    name="username"
                                    className="form-control"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="string"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-4">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            <Alert />
        </div>
    );
};

export default SignupForm;