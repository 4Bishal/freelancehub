import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import server from "../environment";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");

    const verifyAuth = async () => {
        try {
            const { data } = await axios.post(
                `${server}/auth`,
                {},
                { withCredentials: true }
            );

            if (data.status) {
                setRole(data.role); // Ensure backend sends role
                setIsAuthenticated(true);
                setUsername(data.username)
            } else {
                setUsername("")
                setRole(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            setUsername("")
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
    const loginUser = (userRole, username) => {
        setUsername(username)
        setRole(userRole);
        setIsAuthenticated(true);
    };

    // Existing logout method
    const logout = async () => {
        try {
            await axios.post(`${server}/logout`, {}, { withCredentials: true });
            setRole(null);
            setIsAuthenticated(false);
            return true;
        } catch (error) {
            console.error("Logout failed:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ role, isAuthenticated, loading, loginUser, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);