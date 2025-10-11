import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import server from "../environment";

const PostProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        category: "",
    });

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];

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
                `${server}/createproject`,
                { ...formData },
                { withCredentials: true }
            );

            const { message, success } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/clientdashboard", {
                        state: { toastMessage: "New Project Created Successfully" },
                    });
                }, 500);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError("Posting Project failed. Please try again.");
        }
        setFormData({ title: "", description: "", budget: "", deadline: "", category: "" });
    };

    return (
        <div className="overflow-auto px-4 py-10 min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md sm:p-10">
                <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center sm:text-left">
                    Post a New Project
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Title */}
                    <div>
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                            Project Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Build a React Portfolio Site"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                            Project Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Describe your project requirements here..."
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <label htmlFor="budget" className="block text-gray-700 font-medium mb-1">
                            Budget (in USD)
                        </label>
                        <input
                            type="number"
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 100"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. MERN STACK PROJECT"
                        />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label htmlFor="deadline" className="block text-gray-700 font-medium mb-1">
                            Deadline
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                            min={minDate} // restrict past dates
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
                    >
                        Post Project
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PostProject;