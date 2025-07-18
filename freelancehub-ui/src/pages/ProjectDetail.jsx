import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

const ProjectDetail = () => {
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
                const res = await axios.get(`http://localhost:5000/getproject/${id}`, { withCredentials: true });
                const data = res.data;

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
            }
        };

        fetchProject();
    }, [id]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <section className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8">
                <h2 className="text-3xl font-semibold text-indigo-700 border-b border-indigo-300 pb-2 mb-6 text-center">
                    Project Details
                </h2>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{projectData.title}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{projectData.description}</p>

                <div className="space-y-4 text-gray-600 text-sm">
                    {/* Posted By */}
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-indigo-500"
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
                        <span><strong>Posted by:</strong> {postedBy}</span>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                        <span><strong>Category:</strong> {projectData.category}</span>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600"
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
                        <span><strong>Budget:</strong> ${parseInt(projectData.budget).toLocaleString()}</span>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600"
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
                {/*  Go to Dashboard Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => navigate("/freelancerdashboard")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProjectDetail;
