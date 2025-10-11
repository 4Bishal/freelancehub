import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import server from "../environment";

export default function MakeBid() {
    const [bidData, setBidData] = useState({
        amount: "",
        message: "",
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const [postedBy, setPostedBy] = useState("");
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
        deadline: "",
        budget: "",
        category: "",
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${server}/getproject/${id}`, { withCredentials: true });
                // const data = res.project.data;

                const data = res.data.project;

                setProjectData({
                    title: data.title,
                    description: data.description,
                    deadline: data.deadline,
                    budget: data.budget,
                    category: data.category,
                });
                setPostedBy(data.postedby.username);
            } catch (err) {
                console.error("Failed to bid", err);
            }
        };

        fetchProject();
    }, [id]);

    const handleChange = (e) => {
        setBidData((prev) => ({
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
    const handleBidSubmit = async (e) => {
        e.preventDefault();
        // your submit logic hereconst minAllowedBid = projectData.budget * 0.95;
        let minAllowedBid = projectData.budget * 0.95;
        if (Number(bidData.amount) < minAllowedBid) {
            toast.error(`Bid amount must be at least 5% less than the project budget ($${minAllowedBid.toFixed(2)})`);
            return; // stop form submission
        }
        try {
            const { data } = await axios.post(`${server}/createbid/${id}`, bidData, { withCredentials: true });

            const { message, success } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/", { state: { toastMessage: message } });
                }, 500);
            } else {
                handleError(message);
            }
        } catch (err) {
            console.error("Failed to update project", err);
        }
    };

    return (
        <div className="min-h-[80vh] px-4 sm:px-6 lg:px-12 py-12 bg-gray-50 flex flex-col lg:flex-row lg:items-start lg:justify-center lg:space-x-12 space-y-12 lg:space-y-0">

            {/* Project Info Section */}
            <section className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:flex-1">
                <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-300 pb-2 mb-6">
                    Project You Are Bidding On
                </h2>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">{projectData.title}</h3>
                <p className="text-gray-700 mb-8 leading-relaxed">{projectData.description}</p>

                <div className="space-y-5 text-gray-600 text-sm font-medium">
                    <div className="flex items-center text-gray-500 text-sm">
                        {/* Owner Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-indigo-500 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>

                        <strong className="mr-1">Posted by:</strong> {postedBy}
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Category Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-indigo-600 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                        <span><strong>Category:</strong> {projectData.category}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Budget Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-600 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8c-1.104 0-2 .9-2 2 0 1.11 1.1 2 2 2s2 .89 2 2c0 1.11-1.1 2-2 2"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 10v3m-7-6h14" />
                        </svg>
                        <span><strong>Budget:</strong> ${projectData.budget.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Deadline Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-600 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z" />
                        </svg>
                        <span><strong>Deadline:</strong> {projectData.deadline}</span>
                    </div>
                </div>
            </section>

            {/* Bid Form Section */}
            <section className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:flex-1">
                <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-300 pb-2 mb-6">
                    Your Bid
                </h2>

                <form onSubmit={handleBidSubmit} className="space-y-6">
                    <input
                        type="number"
                        name="amount"
                        placeholder="Your Bid Amount"
                        required
                        value={bidData.amount}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 text-lg"
                    />

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        required
                        rows={5}
                        value={bidData.message}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-gray-900 text-lg"
                    ></textarea>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-md font-semibold hover:bg-indigo-700 transition"
                    >
                        Your Bid
                    </button>
                </form>
            </section>

            <ToastContainer />
        </div>

    );
}