import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";

const BrowseProjects = () => {
    const [allProjects, setAllProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get("http://localhost:5000/browseprojects", {
                    withCredentials: true,
                });
                const formatted = res.data.map((project) => ({
                    ...project,
                    deadline: new Date(project.deadline),
                    postedby: project.postedby?.username || "Unknown",
                    id: project._id,
                }));
                setAllProjects(formatted);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const categories = Array.from(new Set(allProjects.map((p) => p.category)));

    const [budgetRange, setBudgetRange] = useState([0, 10000]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [deadlineFilter, setDeadlineFilter] = useState("");
    const [sortBy, setSortBy] = useState("budgetAsc");
    const [expirationFilter, setExpirationFilter] = useState("active"); // new filter: active by default

    const handleBudgetChange = (e, index) => {
        const newRange = [...budgetRange];
        newRange[index] = Number(e.target.value);
        setBudgetRange(newRange);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleDeadlineChange = (e) => {
        setDeadlineFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleExpirationChange = (e) => {
        setExpirationFilter(e.target.value);
    };

    const filteredProjects = useMemo(() => {
        const now = new Date();
        return allProjects
            .filter((p) => {
                // Expiration filter
                if (expirationFilter === "active" && p.deadline < now) return false;
                if (expirationFilter === "expired" && p.deadline >= now) return false;

                // Other filters
                if (p.budget < budgetRange[0] || p.budget > budgetRange[1]) return false;
                if (selectedCategory && p.category !== selectedCategory) return false;
                if (deadlineFilter && p.deadline > new Date(deadlineFilter)) return false;

                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "budgetAsc":
                        return a.budget - b.budget;
                    case "budgetDesc":
                        return b.budget - a.budget;
                    case "deadlineAsc":
                        return a.deadline - b.deadline;
                    case "deadlineDesc":
                        return b.deadline - a.deadline;
                    default:
                        return 0;
                }
            });
    }, [allProjects, budgetRange, selectedCategory, deadlineFilter, sortBy, expirationFilter]);

    return (
        <div className="overflow-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Browse Projects</h1>

            {/* Filters */}
            <div className="p-4 rounded-lg shadow mb-8 flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
                {/* Budget Filter */}
                <div className="flex items-center space-x-2">
                    <label className="font-medium text-gray-700">Budget ($):</label>
                    <input
                        type="number"
                        min="0"
                        max="10000"
                        value={budgetRange[0]}
                        onChange={(e) => handleBudgetChange(e, 0)}
                        className="w-20 px-2 py-1 border rounded"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        min="0"
                        max="10000"
                        value={budgetRange[1]}
                        onChange={(e) => handleBudgetChange(e, 1)}
                        className="w-20 px-2 py-1 border rounded"
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="font-medium text-gray-700 mr-2">Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="border rounded px-3 py-1"
                    >
                        <option value="">All</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Deadline Filter */}
                <div>
                    <label className="font-medium text-gray-700 mr-2">Deadline before:</label>
                    <input
                        type="date"
                        value={deadlineFilter}
                        onChange={handleDeadlineChange}
                        className="border rounded px-3 py-1"
                    />
                </div>

                {/* Expiration Filter */}
                <div>
                    <label className="font-medium text-gray-700 mr-2">Status:</label>
                    <select
                        value={expirationFilter}
                        onChange={handleExpirationChange}
                        className="border rounded px-3 py-1"
                    >
                        <option value="all">All Projects</option>
                        <option value="active">Active (Not Expired)</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>

                {/* Sort By */}
                <div>
                    <label className="font-medium text-gray-700 mr-2">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="border rounded px-3 py-1"
                    >
                        <option value="budgetAsc">Budget: Low to High</option>
                        <option value="budgetDesc">Budget: High to Low</option>
                        <option value="deadlineAsc">Deadline: Soonest</option>
                        <option value="deadlineDesc">Deadline: Latest</option>
                    </select>
                </div>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.length === 0 ? (
                    <p className="text-gray-600 col-span-full text-center">No projects match your filters.</p>
                ) : (
                    filteredProjects.map(({ id, title, description, budget, category, deadline, postedby }) => {
                        const isExpired = deadline < new Date();

                        return (
                            <div
                                key={id}
                                className={`p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col ${isExpired ? "opacity-90" : ""
                                    }`}
                            >
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
                                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">{description}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-indigo-500"
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
                                        <strong className="mr-1">Posted By:</strong> {postedby}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                                        </svg>
                                        <strong className="mr-1">Category:</strong> {category}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-green-500"
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
                                        <strong className="mr-1">Budget:</strong> ${budget.toLocaleString()}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-red-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <strong className="mr-1">Deadline:</strong> {deadline.toLocaleDateString()}
                                    </div>
                                </div>

                                {isExpired ? (
                                    <p className="mt-auto text-sm text-red-500 font-semibold text-center">Bidding Closed</p>
                                ) : (
                                    <button className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded transition">
                                        <Link to={`/makebid/${id}`}>Make your Bid</Link>
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BrowseProjects;
