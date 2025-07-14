import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, XCircle, Search, Send } from "lucide-react";

const FreelancerDashboard = () => {
    const bidsPlaced = [
        {
            id: 1,
            projectTitle: "E-commerce Website Design",
            status: "won", // values: "won", "lost", "pending"
            bidAmount: "$100",
        },
        {
            id: 2,
            projectTitle: "Landing Page UI",
            status: "lost",
            bidAmount: "$60",
        },
        {
            id: 3,
            projectTitle: "Logo for Tech Startup",
            status: "pending",
            bidAmount: "$30",
        }
    ];

    const getStatusBadge = (status) => {
        if (status === "won")
            return (
                <span className="inline-flex items-center text-sm text-green-600 font-medium">
                    <BadgeCheck className="w-4 h-4 mr-1" /> Won
                </span>
            );
        if (status === "lost")
            return (
                <span className="inline-flex items-center text-sm text-red-600 font-medium">
                    <XCircle className="w-4 h-4 mr-1" /> Lost
                </span>
            );
        return (
            <span className="inline-flex items-center text-sm text-yellow-600 font-medium">
                <Send className="w-4 h-4 mr-1" /> Pending
            </span>
        );
    };

    return (
        <div className="px-6 py-10 bg-gray-50 overflow-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Bids</h1>
                <Link
                    to="/browseprojects"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md font-medium shadow hover:bg-indigo-700 transition"
                >
                    <Search className="w-4 h-4" /> Browse Projects
                </Link>
            </div>

            <div className="space-y-6">
                {bidsPlaced.length === 0 ? (
                    <p className="text-gray-600 text-lg">You haven’t placed any bids yet.</p>
                ) : (
                    bidsPlaced.map(({ id, projectTitle, bidAmount, status }) => (
                        <div
                            key={id}
                            className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                    {projectTitle}
                                </h2>
                                <p className="text-gray-600 text-sm mb-2">
                                    Your Bid: <span className="text-indigo-600 font-medium">{bidAmount}</span>
                                </p>
                                {getStatusBadge(status)}
                            </div>
                            <Link
                                to={`/projects/${id}`}
                                className="text-sm text-blue-600 font-medium hover:underline"
                            >
                                View Project →
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FreelancerDashboard;
