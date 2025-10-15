import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Loader } from "lucide-react"; // Added Loader
import server from "../environment";

export default function MakeBid() {
    const [bidData, setBidData] = useState({ amount: "", message: "" });
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
    const [isLoading, setIsLoading] = useState(false); // NEW: loader state

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${server}/getproject/${id}`, { withCredentials: true });
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
                console.error("Failed to fetch project", err);
            }
        };

        fetchProject();
    }, [id]);

    const handleChange = (e) => {
        setBidData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleError = (err) => toast.error(err, { position: "bottom-left" });
    const handleSuccess = (msg) => toast.success(msg, { position: "bottom-left" });

    const handleBidSubmit = async (e) => {
        e.preventDefault();

        let minAllowedBid = projectData.budget * 0.95;
        if (Number(bidData.amount) < minAllowedBid) {
            toast.error(`Bid must be at least 5% less than project budget ($${minAllowedBid.toFixed(2)})`);
            return;
        }

        setIsLoading(true); // start loader
        try {
            const { data } = await axios.post(`${server}/createbid/${id}`, bidData, { withCredentials: true });
            const { message, success } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate("/", { state: { toastMessage: message } }), 500);
            } else {
                handleError(message);
            }
        } catch (err) {
            console.error("Failed to submit bid", err);
            handleError("Failed to submit bid. Try again.");
        } finally {
            setIsLoading(false); // stop loader
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
                        <strong className="mr-1">Posted by:</strong> {postedBy}
                    </div>
                    <div><strong>Category:</strong> {projectData.category}</div>
                    <div><strong>Budget:</strong> ${projectData.budget.toLocaleString()}</div>
                    <div><strong>Deadline:</strong> {projectData.deadline}</div>
                </div>
            </section>

            {/* Bid Form Section */}
            <section className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:flex-1">
                <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-300 pb-2 mb-6">Your Bid</h2>

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
                        disabled={isLoading}
                        className={`w-full bg-indigo-600 text-white py-4 rounded-md font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Placing Bid...
                            </>
                        ) : (
                            "Your Bid"
                        )}
                    </button>
                </form>
            </section>

            <ToastContainer />
        </div>
    );
}
