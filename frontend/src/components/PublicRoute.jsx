// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // your auth context

const PublicRoute = ({ children }) => {
    const { isAuthenticated, role } = useAuth(); // get current user

    // If user is authenticated, redirect them to their dashboard
    if (isAuthenticated) {
        if (role === "freelancer") return <Navigate to="/" replace />;
        if (role === "client") return <Navigate to="/" replace />;
    }

    // Otherwise, allow access
    return children;
};

export default PublicRoute;
