
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";

const PrivateRoute = ({ path, ...props }) => {
    const { isAuthenticated } = useAuthContext();

    return isAuthenticated ? (
        <Route {...props} path={path} />
    ) : (
        <Navigate to="/login" replace state={{ from: path }} />
    );
};

export default PrivateRoute;
