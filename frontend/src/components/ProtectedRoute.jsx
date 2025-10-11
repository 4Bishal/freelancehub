import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { role, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    toastMessage: "Please login to continue.",
                    toastType: "warn",
                }}
            />
        );
    }

    const roles = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

    if (!roles.includes(role)) {
        return (
            <Navigate
                to="/"
                replace
                state={{
                    toastMessage: `Access denied: ${roles.join(" or ")} only`,
                    toastType: "warn",
                }}
            />
        );
    }

    return children;
};

export default ProtectedRoute;
