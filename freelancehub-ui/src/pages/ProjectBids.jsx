import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const ProjectBids = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bidsData, setBidsData] = useState([]);
    const [projectTitle, setProjectTitle] = useState("");

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/getprojectbids/${id}`,
                    { withCredentials: true }
                );
                const formatted = res.data.bids.map((bid) => ({
                    ...bid,
                    id: bid._id,
                    bidBy: bid.freelancer.username,
                }));
                setBidsData(formatted);
                setProjectTitle(res.data.projectTitle);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        };

        fetchBids();
    }, [id]);

    const handleAccept = async (acceptedBidId) => {
        try {
            // Set the accepted bid status to "won"
            await axios.put(
                `http://localhost:5000/updatebidstatus/${acceptedBidId}`,
                { status: "won" },
                { withCredentials: true }
            );

            // Update the frontend state — mark only the accepted bid as "won"
            setBidsData((prev) =>
                prev.map((bid) =>
                    bid.id === acceptedBidId ? { ...bid, status: "won" } : bid
                )
            );
        } catch (error) {
            console.error("Error updating bid status to won:", error);
        }
    };

    const handleReject = async (bidId) => {
        try {
            await axios.put(
                `http://localhost:5000/updatebidstatus/${bidId}`,
                { status: "lost" },
                { withCredentials: true }
            );

            setBidsData((prev) =>
                prev.map((bid) => (bid.id === bidId ? { ...bid, status: "lost" } : bid))
            );
        } catch (error) {
            console.error("Error rejecting bid:", error);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
            {/* Title + Dashboard button container */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-indigo-700">
                    Project:{" "}
                    <span className="text-gray-800 hover:underline transition duration-200 cursor-pointer">
                        {projectTitle || "Loading..."}
                    </span>
                </h1>

                <Link
                    to="/clientdashboard"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-all duration-200"
                >
                    Go To Dashboard
                </Link>
            </div>

            {bidsData.length === 0 ? (
                <p className="text-gray-600 text-lg text-center">
                    No bids placed for this project
                </p>
            ) : (
                bidsData.map(({ id, amount, message, bidBy, status }) => (
                    <div
                        key={id}
                        className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-200 space-y-4"
                    >
                        {/* Status badge top-right */}
                        <div className="absolute top-4 right-4 flex items-center space-x-1">
                            {status === "won" && (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-green-600 font-semibold text-sm">
                                        Accepted
                                    </span>
                                </>
                            )}
                            {status === "lost" && (
                                <>
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-red-600 font-semibold text-sm">
                                        Rejected
                                    </span>
                                </>
                            )}
                            {status === "pending" && (
                                <>
                                    <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
                                    <span className="text-yellow-500 font-semibold text-sm">
                                        Pending
                                    </span>
                                </>
                            )}
                        </div>
                        {/* Bid details */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Freelancer: <span className="text-indigo-600">{bidBy}</span>
                            </h2>
                            <p className="text-gray-700 mt-2">
                                <strong>Bid Amount:</strong>{" "}
                                <span className="text-green-600 font-medium">Rs. {amount}</span>
                            </p>
                            <p className="text-gray-700 mt-1">
                                <strong>Message:</strong>{" "}
                                <span className="text-gray-600 italic">"{message}"</span>
                            </p>
                        </div>

                        {/* Buttons container */}
                        {status !== "won" && (
                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                <button
                                    onClick={() => handleAccept(id)}
                                    disabled={status === "won" || status === "lost"}
                                    className={`
        flex-1 sm:flex-none sm:w-32
        py-3 px-4
        rounded-md
        font-semibold
        transition
        duration-200
        text-white
        shadow-md
        ${status === "lost"
                                            ? "bg-green-400 cursor-not-allowed opacity-60"
                                            : "bg-green-600 hover:bg-green-700 cursor-pointer"
                                        }
      `}
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() => handleReject(id)}
                                    disabled={status === "won" || status === "lost"}
                                    className={`
        flex-1 sm:flex-none sm:w-32
        py-3 px-4
        rounded-md
        font-semibold
        transition
        duration-200
        text-white
        shadow-md
        ${status === "lost"
                                            ? "bg-red-700 cursor-not-allowed opacity-80"
                                            : "bg-red-500 hover:bg-red-600 cursor-pointer"
                                        }
      `}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ProjectBids;
