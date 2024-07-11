
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert";

/**
 * Login Form Component
 * 
 * Login form for existing users to login to their account. 
 * 
 * On successful submission, calls login prop and redirects to Home page ("/"). 
 * 
 * route: /signup
 * 
 * Other components used: Alert
 */

const LoginForm = ({ login }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [formErrors, setFormErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(formData);
            if (result.success) {
                localStorage.setItem("locationPermissionAsked", "false");
                navigate("/");
            } else {
                setFormErrors(result.error);
            }
        } catch (error) {
            console.error("Error during signup:", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

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

                            <div className="mt-4">
                                {formErrors.length
                                    ? <Alert type="danger" messages={formErrors} />
                                    : null
                                }
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;