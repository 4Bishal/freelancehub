import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../components/AuthContext";  // import your context hook
import useRedirectedToast from "../hooks/useRedirectedToast";

export default function Login() {
    const navigate = useNavigate();
    const { loginUser } = useAuth();  // get loginUser from context

    useRedirectedToast();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });
    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-left",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:5000/login",
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
        setFormData({ email: "", password: "" });
    };


    return (
        <div
            className="flex flex-col items-center justify-center h-full px-4"
            style={{ marginTop: "10rem" }}
        >
            <div
                className="bg-white p-8 rounded-2xl max-w-md w-full
          max-h-[calc(100vh-8rem)] overflow-auto shadow-2xl border border-gray-300"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Login to Your Account
                </h2>

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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        Login
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
