import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import server from "../environment";

const ProjectBids = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bidsData, setBidsData] = useState([]);
    const [projectTitle, setProjectTitle] = useState("");
    const [loadingBid, setLoadingBid] = useState(null); // store id of bid being updated

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await axios.get(
                    `${server}/getprojectbids/${id}`,
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
        setLoadingBid(acceptedBidId); // start loading
        try {
            await axios.put(
                `${server}/updatebidstatus/${acceptedBidId}`,
                { status: "won" },
                { withCredentials: true }
            );

            setBidsData((prev) =>
                prev.map((bid) =>
                    bid.id === acceptedBidId
                        ? { ...bid, status: "won" }
                        : { ...bid, status: bid.status === "won" ? "lost" : bid.status }
                )
            );
        } catch (error) {
            console.error("Error updating bid status to won:", error);
        } finally {
            setLoadingBid(null); // stop loading
        }
    };

    const handleReject = async (bidId) => {
        setLoadingBid(bidId); // start loading
        try {
            await axios.put(
                `${server}/updatebidstatus/${bidId}`,
                { status: "lost" },
                { withCredentials: true }
            );

            setBidsData((prev) =>
                prev.map((bid) => (bid.id === bidId ? { ...bid, status: "lost" } : bid))
            );
        } catch (error) {
            console.error("Error rejecting bid:", error);
        } finally {
            setLoadingBid(null); // stop loading
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
                <h1 className="text-3xl font-semibold text-indigo-700 break-words">
                    Project:{" "}
                    <span
                        className="text-gray-800 hover:underline transition duration-200 cursor-pointer break-words"
                        title={projectTitle}
                    >
                        {projectTitle || "Loading..."}
                    </span>
                </h1>
                <Link
                    to="/clientdashboard"
                    className="bg-blue-600 text-white py-2 px-5 rounded-md text-sm hover:bg-blue-700 transition duration-200 whitespace-nowrap"
                >
                    Go To Dashboard
                </Link>
            </div>

            {/* Bids List */}
            {bidsData.length === 0 ? (
                <p className="text-gray-600 text-lg text-center">No bids placed for this project</p>
            ) : (
                <div className="space-y-6">
                    {bidsData.map(({ id, amount, message, bidBy, status }) => (
                        <div
                            key={id}
                            className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-200 space-y-4"
                        >
                            {/* Status badge */}
                            <div className="absolute top-4 right-4 flex items-center space-x-1 select-none">
                                {status === "won" && (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-green-600 font-semibold text-sm">Accepted</span>
                                    </>
                                )}
                                {status === "lost" && (
                                    <>
                                        <XCircle className="w-5 h-5 text-red-600" />
                                        <span className="text-red-600 font-semibold text-sm">Rejected</span>
                                    </>
                                )}
                                {status === "pending" && (
                                    <>
                                        <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
                                        <span className="text-yellow-500 font-semibold text-sm">Pending</span>
                                    </>
                                )}
                            </div>

                            {/* Bid Info */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 break-words">
                                    Freelancer: <span className="text-indigo-600">{bidBy}</span>
                                </h2>
                                <p className="text-gray-700 mt-2">
                                    <strong>Bid Amount:</strong>{" "}
                                    <span className="text-green-600 font-medium">Rs. {amount}</span>
                                </p>
                                <p className="text-gray-700 mt-1 break-words">
                                    <strong>Message:</strong>{" "}
                                    <span className="text-gray-600 italic">"{message}"</span>
                                </p>
                            </div>

                            {/* Action buttons */}
                            {status === "pending" && (
                                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                    <button
                                        onClick={() => handleAccept(id)}
                                        disabled={loadingBid === id}
                                        className={`flex-1 sm:flex-none sm:w-36 py-3 px-4 rounded-md font-semibold transition duration-200 text-white shadow-md ${loadingBid === id
                                            ? "bg-green-500 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                            }`}
                                    >
                                        {loadingBid === id ? (
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
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
                                        ) : null}
                                        {loadingBid === id ? "Processing..." : "Accept"}
                                    </button>

                                    <button
                                        onClick={() => handleReject(id)}
                                        disabled={loadingBid === id}
                                        className={`flex-1 sm:flex-none sm:w-36 py-3 px-4 rounded-md font-semibold transition duration-200 text-white shadow-md ${loadingBid === id
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                            }`}
                                    >
                                        {loadingBid === id ? (
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
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
                                        ) : null}
                                        {loadingBid === id ? "Processing..." : "Reject"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectBids;
