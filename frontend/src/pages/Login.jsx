import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../components/AuthContext";  // import your context hook
import useRedirectedToast from "../hooks/useRedirectedToast";
import server from "../environment";

export default function Login() {
    const navigate = useNavigate();
    // console.log(server);
    const { loginUser } = useAuth();
    useRedirectedToast();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false); // <-- loading state

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleError = (err) =>
        toast.error(err, { position: "bottom-left" });
    const handleSuccess = (msg) =>
        toast.success(msg, { position: "bottom-left" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // start loading
        try {
            const { data } = await axios.post(
                `${server}/login`,
                { ...formData },
                { withCredentials: true }
            );
            const { success, message, role } = data;

            if (success) {
                handleSuccess(message);
                loginUser(role);
                setTimeout(() => {
                    navigate("/", { state: { toastMessage: "Welcome to FreelancerHub!" } });
                }, 500);
            } else {
                handleError(message);
            }
        } catch (error) {
            handleError("Login failed. Please try again.");
        }
        setLoading(false); // stop loading
        setFormData({ email: "", password: "" });
    };

    return (
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-20" style={{ marginTop: "6rem" }}>
            <div className="bg-white p-8 rounded-2xl max-w-md w-full max-h-[calc(100vh-6rem)] overflow-auto shadow-2xl border border-gray-300">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login to Your Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
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

                    {/* Password */}
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
                    {/* Inline message */}
                    {message && (
                        <p className={`text-sm mt-2 text-center ${messageType === "error" ? "text-red-600" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}
                    {/* Submit Button with spinner */}
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center transition-all duration-300 ${loading
                            ? "bg-indigo-500 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
}
