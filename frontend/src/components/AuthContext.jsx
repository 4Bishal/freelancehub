import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import server from "../environment";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ Verify JWT from backend
    const verifyAuth = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${server}/auth`,
                {},
                { withCredentials: true }
            );

            if (data.status) {
                setRole(data.role);
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

    // ✅ Login user
    const loginUser = async (email, password) => {
        try {
            const { data } = await axios.post(
                `${server}/login`,
                { email, password },
                { withCredentials: true }
            );

            if (data.success) {
                setRole(data.role);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                setRole(null);
                setIsAuthenticated(false);
                return { success: false, message: data.message };
            }
        } catch (err) {
            setRole(null);
            setIsAuthenticated(false);
            return { success: false, message: err.message };
        }
    };

    // ✅ Logout user
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
        <AuthContext.Provider
            value={{
                role,
                isAuthenticated,
                loading,
                verifyAuth,
                loginUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
