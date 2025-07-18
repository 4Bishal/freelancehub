import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, XCircle, Search, Send } from "lucide-react";
import axios from "axios";


const FreelancerDashboard = () => {
    const [myBids, setMyBids] = useState([]);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await axios.get('http://localhost:5000/getmybids', { withCredentials: true });
                const bidsPlaced = res.data.bids.map((bid) => ({
                    ...bid,
                    id: bid._id,
                    projectTitle: bid.project.title,
                    projId: bid.project._id,
                }));
                setMyBids(bidsPlaced);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        };

        fetchBids(); // call the async function
    }, []);

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
        <div className="px-6 py-10 overflow-auto">
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
                {myBids.length === 0 ? (
                    <p className="text-gray-600 text-lg">You haven’t placed any bids yet.</p>
                ) : (
                    myBids.map(({ id, amount, status, projectTitle, projId }) => (
                        <div
                            key={id}
                            className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                    {projectTitle}
                                </h2>
                                <p className="text-gray-600 text-sm mb-2">
                                    Your Bid: <span className="text-indigo-600 font-medium">{amount}</span>
                                </p>
                                {getStatusBadge(status)}
                            </div>
                            <Link
                                to={`/projectdetail/${projId}`}
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
