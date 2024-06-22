
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert";

/**
 * Signup Form Component
 * 
 * Signup form for new users to register with EventSpotter. 
 * 
 * On successful submission, calls signup prop and redirects to Home page ("/").
 * 
 * route: /signup
 * 
 * Other components used: Alert
 */

const SignupForm = ({ signup }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
    });
    const [formErrors, setFormErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await signup(formData);
            if (result.success) {
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
                <h2 className="mb-3">Sign Up</h2>
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

                            {formErrors.length
                                ? <Alert type="danger" messages={formErrors} />
                                : null
                            }

                            <button
                                type="submit"
                                className="btn btn-primary float-right"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
