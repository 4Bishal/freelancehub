import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import server from "../environment";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");

    // Verify user session on load
    const verifyAuth = async () => {
        try {
            const { data } = await axios.post(`${server}/auth`, {}, { withCredentials: true });
            if (data.status) {
                setRole(data.role);
                setIsAuthenticated(true);
                setUsername(data.username);
            } else {
                setUsername("");
                setRole(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            setUsername("");
            setRole(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyAuth();
    }, []);

    // Login function to update context immediately
    const loginUser = (userRole, userName) => {
        setRole(userRole);
        setUsername(userName);
        setIsAuthenticated(true);
    };

    // Logout
    const logout = async () => {
        try {
            await axios.post(`${server}/logout`, {}, { withCredentials: true });
            setRole(null);
            setUsername("");
            setIsAuthenticated(false);
            return true;
        } catch (err) {
            console.error("Logout failed:", err);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ role, username, isAuthenticated, loginUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
