import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../components/AuthContext";
import server from "../environment";

export default function Login() {
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const showToast = (msg, error = false) => {
        if (error) toast.error(msg, { position: "bottom-left" });
        else toast.success(msg, { position: "bottom-left" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // reset message
        try {
            const { data } = await axios.post(
                `${server}/login`,
                { ...formData },
                { withCredentials: true }
            );
            const { success, message: msg, role, username } = data;

            setMessage(msg);
            setIsError(!success);
            showToast(msg, !success);

            if (success) {
                loginUser(role, username);

                // Clear form fields only on success
                setFormData({ email: "", password: "" });

                // Navigate to home page first
                navigate("/");

                // Then refresh the entire page after 1 second
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // 1 second delay
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || "Login failed. Please try again.";
            setMessage(errMsg);
            setIsError(true);
            showToast(errMsg, true);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-20 mt-24">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl border border-gray-300">
                <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>

                    {message && (
                        <p className={`mt-2 text-center ${isError ? "text-red-600" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}
                </form>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 hover:underline">Register here</Link>
                </p>
            </div>

            <ToastContainer />
        </div>
    );
}
