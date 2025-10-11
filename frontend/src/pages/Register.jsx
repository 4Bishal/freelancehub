import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Lock, Briefcase } from "lucide-react";
import axios from 'axios';
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
            position: "bottom-right",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${server}/signup`,
                {
                    ...formData,
                },
                { withCredentials: true }
            );
            const { success, message } = data;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                handleError(message);
            }
        } catch (error) {
            console.log(error);
        }
        setFormData({
            ...formData,
            email: "",
            username: "",
            password: "",
            role: "freelancer",
        });

    };

    return (
        <div
            className="flex flex-col items-center justify-center  px-4"
            style={{ marginTop: "6rem", marginBottom: "0rem" }}
        >
            <div
                className="bg-white p-8 rounded-2xl max-w-md w-full
      max-h-[calc(100vh-8rem)] overflow-auto shadow-2xl border border-gray-300"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Create an Account
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
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
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