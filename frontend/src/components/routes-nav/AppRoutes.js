
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Homepage from "../homepage/Homepage";
import QuickTips from "../quickTips/QuickTips";
import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import Profile from "../user/Profile";
import DeleteAccount from "../user/DeleteAccount";
import ThankYou from "../user/ThankYou";
import EventMap from "../mapComponents/EventMap";
import PrivateRoute from "./PrivateRoute";

/**
 * AppRoutes Component
 * 
 * Defines application routes using React Router. It includes routes for the homepage, quick tips,  authentication (login/signup), and private routes for authenticated users.
 * 
 * Visiting a non-existent route redirects to the homepage. 
 * 
 * Props:
 * - signup: function to handle user registration.
 * - login: function to handle user login.
 * - updateUser: function to update user information.
 */

const AppRoutes = () => {
    return (
        <div className="pt-5">
            <Routes>
                <Route exact path="/" element={<Homepage />} />
                <Route exact path="/quick-tips" element={<QuickTips />} /> 
                <Route exact path="/signup" element={<SignupForm />} />
                <Route exact path="/login" element={<LoginForm />} />

                {/* Private Routes */}
                <Route exact path="/profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>}
                />
                <Route exact path="/delete" element={
                    <PrivateRoute>
                        <DeleteAccount />
                    </PrivateRoute>}
                />
                <Route exact path="/map" element={
                    <PrivateRoute>
                        <EventMap />
                    </PrivateRoute>}
                />
                
                <Route exact path="/thank-you" element={<ThankYou />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;