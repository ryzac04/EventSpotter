
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import Alert from "../common/Alert";

/**
 * LoginForm Component
 * 
 * Renders a login form for existing users to login to their account. 
 * It handles form submission, user input changes, and manages error messages. 
 * 
 * On successful submission, calls login function from the AuthContext and redirects to Home page ("/"). 
 * If an error occurs during login, it sets the error message in the MessageContext. 
 * 
 * route: /signup
 * 
 * Other components used: Alert
 */

const LoginForm = () => {
    const { login } = useAuthContext();
    const { setError, clearError, clearSuccess, clearInfo } = useContext(MessageContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    useEffect(() => {
        clearError();
        clearSuccess();
        clearInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(formData);
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
                <h2 className="heading-text">Log In</h2>
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
                            <button type="submit" className="btn btn-primary mt-4">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            <Alert />
        </div>
    );
};

export default LoginForm;