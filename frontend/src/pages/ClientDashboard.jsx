import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import server from "../environment";
import 'react-toastify/dist/ReactToastify.css';

const ClientDashboard = () => {
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true); // <-- loading state
    const now = new Date();

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true); // start loading
            try {
                const res = await axios.get(`${server}/getprojects`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    const formatted = res.data.projects.map(project => ({
                        ...project,
                        deadlineDate: new Date(project.deadline),
                        deadline: new Date(project.deadline).toLocaleDateString("en-GB"),
                        budget: project.budget.toLocaleString(),
                        postedby: project.postedby?.username || "Unknown",
                    }));

                    setMyProjects(formatted);
                } else {
                    toast.error(res.data.message || "Failed to load projects");
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
                toast.error("Failed to fetch projects from server");
            } finally {
                setLoading(false); // stop loading
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await axios.delete(`${server}/deleteproject/${projectId}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                setMyProjects(prev => prev.filter(p => p._id !== projectId));
                toast.success(res.data.message || "Project deleted successfully!");
            } else {
                toast.error("Project deletion failed!");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error deleting project");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-grow px-4 sm:px-6 md:px-6 py-6 overflow-auto box-border">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
                <h1 className="text-3xl font-bold text-gray-800">
                    My Projects (
                    <span className="text-sm font-semibold text-gray-800 ml-2">
                        Project Count = <i>{myProjects.length}</i>
                    </span>
                    )
                </h1>
                <Link
                    to="/postproject"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md font-medium shadow hover:bg-indigo-700 transition whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" /> Post New Project
                </Link>
            </div>

            {/* Projects */}
            <div className="space-y-6">
                {myProjects.length === 0 ? (
                    <p className="text-gray-600 text-lg">You haven't posted any projects yet.</p>
                ) : (
                    myProjects.map(project => {
                        const isExpired = project.deadlineDate < now;
                        return (
                            <div
                                key={project._id}
                                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row md:items-start md:justify-between gap-6"
                            >
                                {/* LEFT: Project Content */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{project.title}</h2>
                                    {isExpired && <p className="text-red-600 font-semibold mb-2">⚠️ Deadline Passed</p>}
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-4">{project.description}</p>

                                    <div className="flex flex-wrap gap-3 text-sm mb-3">
                                        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                                            💰 Budget: {project.budget}
                                        </span>
                                        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                                            📂 Category: {project.category}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="text-gray-700 font-semibold flex items-center gap-1">
                                            🗓{" "}
                                            <span className={`font-medium ${isExpired ? "text-red-600" : "text-blue-600"}`}>
                                                {project.deadline}
                                            </span>
                                        </span>
                                        <span className="text-gray-700 font-semibold flex items-center gap-1">
                                            👤 <span className="text-green-600 font-medium">{project.postedby}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT: Action Buttons */}
                                <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 justify-start">
                                    <Link
                                        to={`/editproject/${project._id}`}
                                        className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline px-3 py-1"
                                    >
                                        <Pencil className="w-4 h-4" /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        className="flex items-center gap-1 text-sm text-red-600 font-medium hover:underline px-3 py-1"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                    <Link
                                        to={`/projectbids/${project._id}`}
                                        className="flex items-center gap-1 text-sm text-green-600 font-medium hover:underline px-3 py-1"
                                    >
                                        🧾 Check Bids
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <ToastContainer />
        </div>
    );
};

export default ClientDashboard;
