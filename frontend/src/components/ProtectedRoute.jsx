import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { role, isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ toastMessage: "Please login to continue.", toastType: "warn" }}
            />
        );
    }

    if (!allowedRoles.includes(role)) {
        const allowed = allowedRoles.join(" or ");
        const properRole = allowed.charAt(0).toUpperCase() + allowed.slice(1);

        return (
            <Navigate
                to="/"
                replace
                state={{
                    toastMessage: `Access denied: ${properRole}-only allowed`,
                    toastType: "warn",
                }}
            />
        );
    }

    return children;
};

export default ProtectedRoute;