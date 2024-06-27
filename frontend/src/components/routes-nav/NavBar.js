
import { NavLink, Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";

import "./NavBar.css";

/**
 * NavBar Component
 * 
 * Navigation bar for site - shows up on every page. 
 * 
 * Logged out user shows links to login and signup forms. 
 * Logged in user shows username as link to profile page and logout button.
 */

const NavBar = ({logout}) => {
    const { currentUser } = useAuthContext();
    console.debug("Navigation", "currentUser=", currentUser);
    
    const loggedInNav = () => {
        return (
            <ul className="navbar-nav ms-auto">
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/map">
                        Find Fun!
                    </NavLink>
                </li>
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/profile">
                        Profile
                    </NavLink>
                </li>
                <li className="nav-item">
                    <Link className="nav-link logout-link" to="/" onClick={logout}>
                        Log out {currentUser.username}
                    </Link>
                </li>
            </ul>
        );
    }

    const loggedOutNav = () => {
        return (
            <ul className="navbar-nav ms-auto">
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/login">
                        Login
                    </NavLink>
                </li>
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/signup">
                        Signup
                    </NavLink>
                </li>
            </ul>
        );
    }

    return (
        <nav className="Navigation navbar navbar-expand-md">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">EventSpotter</Link>
                {currentUser ? loggedInNav() : loggedOutNav()}
            </div>
        </nav>
    );
};


export default NavBar;