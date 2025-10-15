import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import useRedirectedToast from "../hooks/useRedirectedToast";
import server from "../environment";

const ClientDashboard = () => {
    useRedirectedToast();

    const [myProjects, setMyProjects] = useState([]);
    const [projectToDelete, setProjectToDelete] = useState(null); // store id for deletion

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${server}/getprojects`, { withCredentials: true });

                const postedBy = res.data.projects[0]?.postedby;

                const formatted = res.data.projects.map((project) => ({
                    ...project,
                    deadlineDate: new Date(project.deadline),
                    deadline: new Date(project.deadline).toLocaleDateString("en-GB"),
                    budget: `${project.budget.toLocaleString()}`,
                    postedby: postedBy?.username,
                    id: project._id,
                }));

                setMyProjects(formatted);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        };

        fetchProjects();
    }, []);

    // Confirm delete
    const confirmDelete = async () => {
        try {
            const res = await axios.delete(`${server}/deleteproject/${projectToDelete}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                setMyProjects((prev) => prev.filter((project) => project._id !== projectToDelete));
                toast.success(res.data.message || "Project deleted successfully!");
            } else {
                toast.warn("Project deleted, but response is unexpected.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting project.");
            console.error(err);
        } finally {
            setProjectToDelete(null); // close modal
        }
    };

    const cancelDelete = () => setProjectToDelete(null);

    const now = new Date();

    return (
        <div className="flex-grow px-4 sm:px-6 md:px-6 py-6 overflow-auto box-border">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
                <h1 className="text-3xl font-bold text-gray-800">
                    My Projects(
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

            {/* Project List */}
            <div className="space-y-6">
                {myProjects.length === 0 ? (
                    <p className="text-gray-600 text-lg">You haven't posted any projects yet.</p>
                ) : (
                    myProjects.map((project) => {
                        const isExpired = project.deadlineDate < now;

                        return (
                            <div
                                key={project.id}
                                className="bg-white p-5 rounded-xl shadow-md flex flex-col md:flex-row md:items-start md:justify-between gap-6 hover:shadow-lg transition"
                            >
                                {/* LEFT: Project Info */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{project.title}</h2>
                                    {isExpired && <p className="text-red-600 font-semibold mb-2">⚠️ Deadline Passed</p>}
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-4">{project.description}</p>

                                    <div className="flex flex-wrap gap-3 text-sm mb-3">
                                        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                                            💰 Budget: {project.budget}
                                        </span>
                                        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                                            📂 Category: {project.category}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="text-gray-700 font-semibold flex items-center gap-1 whitespace-nowrap">
                                            🗓{" "}
                                            <span className={`font-medium ${isExpired ? "text-red-600" : "text-blue-600"}`}>
                                                {project.deadline}
                                            </span>
                                        </span>
                                        <span className="text-gray-700 font-semibold flex items-center gap-1 whitespace-nowrap">
                                            👤 <span className="text-green-600 font-medium">{project.postedby}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT: Action Buttons */}
                                <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 justify-start">
                                    <Link
                                        to={`/editproject/${project.id}`}
                                        className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline px-3 py-1"
                                    >
                                        <Pencil className="w-4 h-4" /> Edit
                                    </Link>
                                    <button
                                        onClick={() => setProjectToDelete(project.id)}
                                        className="flex items-center gap-1 text-sm text-red-600 font-medium hover:underline px-3 py-1"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                    <Link
                                        to={`/projectbids/${project.id}`}
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

            {/* Animated Modal */}
            <ConfirmModal
                isOpen={!!projectToDelete}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Are you sure you want to delete this project? This action cannot be undone."
            />

            <ToastContainer />
        </div>
    );
};

export default ClientDashboard;
