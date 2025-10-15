import server from "../environment";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "lucide-react"; // Added Loader

export default function EditProject() {
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

    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false); // NEW: for submit button

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${server}/getproject/${id}`, {
                    withCredentials: true,
                });
                const data = res.data.project;

                setProjectData({
                    title: data.title,
                    description: data.description,
                    deadline: data.deadline.slice(0, 10),
                    budget: data.budget,
                    category: data.category,
                });
                setPostedBy(data.postedby.username);
            } catch (err) {
                console.error("Failed to fetch project", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-10">Loading project data...</p>;
    }

    const handleError = (err) =>
        toast.error(err, { position: "bottom-left" });
    const handleSuccess = (msg) =>
        toast.success(msg, { position: "bottom-left" });

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // start loader
        try {
            const { data } = await axios.put(
                `${server}/editproject/${id}`,
                projectData,
                { withCredentials: true }
            );

            const { message, success } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/clientdashboard", {
                        state: { toastMessage: "Project Updated Successfully" },
                    });
                }, 500);
            } else {
                handleError(message);
            }
        } catch (err) {
            console.error("Failed to update project", err);
            handleError("Failed to update project. Try again.");
        } finally {
            setIsLoading(false); // stop loader
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6">
            <h2 className="text-3xl font-semibold mb-4 text-center sm:text-left">Edit Project</h2>
            <p className="text-sm font-semibold mb-6 text-center sm:text-left">
                Posted By : <i>@{postedBy}</i>
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="title"
                    value={projectData.title}
                    onChange={handleChange}
                    className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Title"
                    required
                />
                <textarea
                    name="description"
                    value={projectData.description}
                    onChange={handleChange}
                    className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full resize-y min-h-[100px]"
                    placeholder="Description"
                    required
                />
                <input
                    type="number"
                    name="budget"
                    value={projectData.budget}
                    onChange={handleChange}
                    className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Budget"
                    required
                    min="0"
                />
                <input
                    type="text"
                    name="category"
                    value={projectData.category}
                    onChange={handleChange}
                    className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Category"
                    required
                />
                <input
                    type="date"
                    name="deadline"
                    value={projectData.deadline}
                    onChange={handleChange}
                    className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    required
                    min={minDate}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full sm:w-auto flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {isLoading ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update Project"
                    )}
                </button>
            </form>
        </div>
    );
}
