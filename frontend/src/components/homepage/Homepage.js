
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";

/**
 * Homepage Component
 * 
 * 
 * route: / 
 */

const Homepage = () => {
  const { currentUser } = useAuthContext();
  console.debug("Homepage", "currentUser=", currentUser);

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 font-weight-bold">EventSpotter</h1>
        <p className="lead">Fun at your fingertips.</p>
        {currentUser
          ? <h2>
            Welcome Back, {currentUser.username}!
          </h2>
          : (
            <p>
              <Link className="btn btn-primary font-weight-bold mr-3"
                to="/login">
                Log in
              </Link>
              <Link className="btn btn-primary font-weight-bold"
                to="/signup">
                Sign up
              </Link>
            </p>
          )
        }
      </div>
    </div>
  );
}

export default Homepage;