
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";

/**
 * Homepage Component
 * 
 * Renders the homepage of the EventSpotter application. Displays a welcome message and provides navigation options based on the user's authentication status.
 * 
 * route: / 
 */

const Homepage = () => {
  const { currentUser } = useAuthContext();

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 fw-bold">EventSpotter</h1>
        <p className="lead">Fun at your fingertips.</p>
        {currentUser
          ? <div>
            <h2 className="mb-4">
              Welcome, {currentUser.username}!
            </h2>
            <p className="lead">We're glad you're here! Click on Find Fun! at the top to get started or head to our Quick Tips page to help you search like a pro!</p>
          </div>
          : (
            <p>
              <Link className="btn btn-primary fw-bold me-3"
                to="/login">
                Log in
              </Link>
              <Link className="btn btn-primary fw-bold"
                to="/signup">
                Sign up
              </Link>
            </p>
          )
        }
      </div>
    </div>
  );
};

export default Homepage;