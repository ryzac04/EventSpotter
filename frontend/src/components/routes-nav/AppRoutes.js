
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Homepage from "../homepage/Homepage";
import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import Profile from "../user/Profile";
import DeleteAccount from "../user/DeleteAccount";

/**
 * AppRoutes Component
 * 
 * Defines application routes using React Router. It includes routes for the homepage, authentication (login/signup), and private routes for authenticated users.
 * 
 * Visiting a non-existent route redirects to the homepage. 
 * 
 * Props:
 * - signup: function to handle user registration.
 * - login: function to handle user login.
 * - updateUser: function to update user information.
 */

const AppRoutes = ({ signup, login, updateUser }) => {
    return (
        <div className="pt-5">
            <Routes>
                <Route exact path="/" element={<Homepage />} />
                <Route exact path="/signup" element={<SignupForm signup={signup} />} />
                <Route exact path="/login" element={<LoginForm login={login} />} />
                <Route exact path="/profile" element={<Profile updateUser={updateUser} />} />
                <Route exact path="/delete" element={<DeleteAccount />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;