import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const verifyAuth = async () => {
        try {
            const { data } = await axios.post(
                "http://localhost:5000/auth",
                {},
                { withCredentials: true }
            );

            if (data.status) {
                setRole(data.role); // Ensure backend sends role
                setIsAuthenticated(true);
            } else {
                setRole(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            setRole(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyAuth();
    }, []);

    // Add loginUser method to update auth state after login
    const loginUser = (userRole) => {
        setRole(userRole);
        setIsAuthenticated(true);
    };

    // Existing logout method
    const logout = async () => {
        try {
            await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
            setRole(null);
            setIsAuthenticated(false);
            return true;
        } catch (error) {
            console.error("Logout failed:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ role, isAuthenticated, loading, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
