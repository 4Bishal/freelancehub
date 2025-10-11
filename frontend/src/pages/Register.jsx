import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Lock, Briefcase } from "lucide-react";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import server from "../environment";
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        role: "freelancer",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const showToast = (msg, type) => {
        if (type === "success") toast.success(msg, { position: "bottom-right" });
        else toast.error(msg, { position: "bottom-left" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(""); // reset inline message

        try {
            const { data } = await axios.post(
                `${server}/signup`,
                { ...formData },
                { withCredentials: true }
            );

            const { success, message: msg } = data;
            setMessage(msg);
            setMessageType(success ? "success" : "error");
            showToast(msg, success ? "success" : "error");

            if (success) {
                setTimeout(() => navigate("/"), 1000);
                // Reset form only on success
                setFormData({ email: "", username: "", password: "", role: "freelancer" });
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Something went wrong!";
            setMessage(errorMsg);
            setMessageType("error");
            showToast(errorMsg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-4" style={{ marginTop: "6rem" }}>
            <div className="bg-white p-8 rounded-2xl max-w-md w-full max-h-[calc(100vh-8rem)] overflow-auto shadow-2xl border border-gray-300">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Create an Account
                </h2>

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

                    {/* Username */}
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            value={formData.username}
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

                    {/* Role */}
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="client">Client</option>
                            <option value="freelancer">Freelancer</option>
                        </select>
                    </div>

                    {/* Submit Button */}
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
                                Registering...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>

                    {/* Inline message */}
                    {message && (
                        <p className={`text-sm mt-2 text-center ${messageType === "error" ? "text-red-600" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}
                </form>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>

            <ToastContainer />
        </div>
    );
}
