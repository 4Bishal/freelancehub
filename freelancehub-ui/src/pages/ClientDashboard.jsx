import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";

const ClientDashboard = () => {
    const myProjects = [
        {
            id: 1,
            title: "Portfolio Website in React",
            description: "Build a fully responsive portfolio site with animations.",
            baseBid: "$50",
        },
        {
            id: 2,
            title: "Social Media UI in Figma",
            description: "Design a mobile-first social media app interface.",
            baseBid: "$70",
        }
    ];

    return (
        <div className="flex-grow px-6 py-6 bg-gray-50 overflow-auto box-border">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
                <Link
                    to="/post-project"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md font-medium shadow hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" /> Post New Project
                </Link>
            </div>

            <div className="space-y-6">
                {myProjects.length === 0 ? (
                    <p className="text-gray-600 text-lg">You haven’t posted any projects yet.</p>
                ) : (
                    myProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                    {project.title}
                                </h2>
                                <p className="text-gray-600 text-sm">{project.description}</p>
                                <span className="text-sm font-medium text-indigo-600 mt-2 inline-block">
                                    Base Bid: {project.baseBid}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    to={`/edit-project/${project.id}`}
                                    className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
                                >
                                    <Pencil className="w-4 h-4" /> Edit
                                </Link>
                                <button
                                    onClick={() => console.log("Delete", project.id)}
                                    className="flex items-center gap-1 text-sm text-red-600 font-medium hover:underline"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
