import React, { useState, useMemo } from "react";

const allProjects = [
    {
        id: 1,
        title: "Build a Portfolio Website",
        description: "Looking for a responsive personal portfolio site with animations.",
        budget: 50,
        category: "Web Development",
        deadline: "2025-08-20",
    },
    {
        id: 2,
        title: "Design a Mobile App UI",
        description: "Need a clean UI for a finance tracking app in Figma.",
        budget: 80,
        category: "UI/UX Design",
        deadline: "2025-07-30",
    },
    {
        id: 3,
        title: "Create Social Media Ads",
        description: "Ad creatives for a product launch campaign. 3-5 images.",
        budget: 40,
        category: "Graphic Design",
        deadline: "2025-09-15",
    },
    {
        id: 4,
        title: "E-commerce Website Development",
        description: "Create a full-featured online store with payment gateway integration.",
        budget: 120,
        category: "Web Development",
        deadline: "2025-08-31",
    },
    {
        id: 5,
        title: "Logo Design for Startup",
        description: "Design a modern and minimalist logo for a tech startup.",
        budget: 30,
        category: "Graphic Design",
        deadline: "2025-07-25",
    },
    {
        id: 6,
        title: "SEO Optimization",
        description: "Improve website SEO to increase organic traffic and rankings.",
        budget: 90,
        category: "Digital Marketing",
        deadline: "2025-09-10",
    },
    {
        id: 7,
        title: "Social Media Management",
        description: "Manage and grow social media accounts for a small business.",
        budget: 60,
        category: "Marketing",
        deadline: "2025-08-15",
    },
    {
        id: 8,
        title: "Mobile App Bug Fixes",
        description: "Fix bugs and improve performance for an existing Android app.",
        budget: 75,
        category: "Mobile Development",
        deadline: "2025-07-29",
    },
    {
        id: 9,
        title: "Content Writing for Blog",
        description: "Write SEO-friendly articles on tech and programming topics.",
        budget: 40,
        category: "Writing",
        deadline: "2025-08-05",
    },
    {
        id: 10,
        title: "Video Editing for YouTube Channel",
        description: "Edit videos with transitions, effects, and subtitles for regular uploads.",
        budget: 85,
        category: "Video Editing",
        deadline: "2025-08-22",
    },
    {
        id: 11,
        title: "Custom WordPress Theme",
        description: "Develop a custom responsive WordPress theme based on design files.",
        budget: 110,
        category: "Web Development",
        deadline: "2025-09-01",
    },
    {
        id: 12,
        title: "Product Photography",
        description: "Shoot and edit product photos for an online catalog.",
        budget: 55,
        category: "Photography",
        deadline: "2025-08-10",
    },
    {
        id: 13,
        title: "Chatbot Development",
        description: "Build an AI-powered chatbot for customer support integration.",
        budget: 130,
        category: "AI Development",
        deadline: "2025-09-05",
    },
    // Add more projects as needed
];

// Unique categories for filter dropdown
const categories = Array.from(new Set(allProjects.map(p => p.category)));

const BrowseProjects = () => {
    // Filter and sort states
    const [budgetRange, setBudgetRange] = useState([0, 1000]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [deadlineFilter, setDeadlineFilter] = useState("");
    const [sortBy, setSortBy] = useState("budgetAsc");

    // Handler helpers
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

    // Filter and sort projects with useMemo for performance
    const filteredProjects = useMemo(() => {
        return allProjects
            .filter((p) => {
                // Budget filter
                if (p.budget < budgetRange[0] || p.budget > budgetRange[1]) return false;
                // Category filter
                if (selectedCategory && p.category !== selectedCategory) return false;
                // Deadline filter (deadlineFilter is YYYY-MM-DD)
                if (deadlineFilter && new Date(p.deadline) > new Date(deadlineFilter)) return false;
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "budgetAsc":
                        return a.budget - b.budget;
                    case "budgetDesc":
                        return b.budget - a.budget;
                    case "deadlineAsc":
                        return new Date(a.deadline) - new Date(b.deadline);
                    case "deadlineDesc":
                        return new Date(b.deadline) - new Date(a.deadline);
                    default:
                        return 0;
                }
            });
    }, [budgetRange, selectedCategory, deadlineFilter, sortBy]);

    return (
        <div className="overflow-auto bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Browse Projects</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">

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
                            <option key={cat} value={cat}>{cat}</option>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                    <p className="text-gray-600 col-span-full">No projects match your filters.</p>
                ) : (
                    filteredProjects.map(({ id, title, description, budget, category, deadline }) => (
                        <div
                            key={id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                            <p className="text-gray-600 mb-2 line-clamp-3">{description}</p>
                            <div className="text-sm text-gray-500 mb-1">
                                <strong>Category:</strong> {category}
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                                <strong>Budget:</strong> ${budget}
                            </div>
                            <div className="text-sm text-gray-500">
                                <strong>Deadline:</strong> {new Date(deadline).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BrowseProjects;
