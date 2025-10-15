import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Lock, Briefcase, Loader } from "lucide-react"; // Added Loader
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import server from "../environment";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        role: "freelancer",
    });
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // NEW loader state

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const showToast = (msg, error = false) => {
        if (error) toast.error(msg, { position: "bottom-left" });
        else toast.success(msg, { position: "bottom-right" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true); // start loader
        try {
            const { data } = await axios.post(`${server}/signup`, formData, { withCredentials: true });
            const { success, message: msg } = data;

            setMessage(msg);
            setIsError(!success);
            showToast(msg, !success);

            if (success) {
                setFormData({ email: "", username: "", password: "", role: "freelancer" });
                setTimeout(() => navigate("/login"), 1000);
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || "Something went wrong. Try again.";
            setMessage(errMsg);
            setIsError(true);
            showToast(errMsg, true);
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false); // stop loader
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-4" style={{ marginTop: "6rem" }}>
            <div className="bg-white p-8 rounded-2xl max-w-md w-full max-h-[calc(100vh-8rem)] overflow-auto shadow-2xl border border-gray-300">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
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

                    {/* Username Field */}
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

                    {/* Password Field */}
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

                    {/* Role Select */}
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
                        disabled={isLoading}
                        className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Registering...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>

                    {/* Inline Message */}
                    {message && (
                        <p className={`mt-2 text-center ${isError ? "text-red-600" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}
                </form>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">Login here</Link>
                </p>
            </div>

            <ToastContainer />
        </div>
    );
}
