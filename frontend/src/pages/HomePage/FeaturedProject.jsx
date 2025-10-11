import React, { useState } from "react";
import { Link } from "react-router-dom";

const FeaturedProject = () => {
    const [showPopup, setShowPopup] = useState(false);

    const projects = [
        {
            id: 1,
            title: "Build a Portfolio Website",
            description:
                "Looking for a responsive personal portfolio site with animations.",
            baseBid: "$50",
            tag: "Web Development",
        },
        {
            id: 2,
            title: "Design a Mobile App UI",
            description: "Need a clean UI for a finance tracking app in Figma.",
            baseBid: "$80",
            tag: "UI/UX Design",
        },
        {
            id: 3,
            title: "Create Social Media Ads",
            description: "Ad creatives for a product launch campaign. 3-5 images.",
            baseBid: "$40",
            tag: "Graphic Design",
        },
    ];

    const handleViewClick = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <section
            className="py-16 px-4 sm:px-6 md:px-12 lg:px-20 relative"
            id="featured-project"
        >
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    Featured Projects
                </h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                    Browse active projects freelancers have posted and start bidding!
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(({ id, title, description, baseBid, tag }) => (
                    <div
                        key={id}
                        className="bg-blue-50 p-4 sm:p-5 md:p-6 rounded-xl shadow hover:shadow-md transition"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {description}
                        </p>
                        <div className="text-sm text-gray-500 mb-2">
                            <span className="font-medium text-gray-700">Category:</span> {tag}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-indigo-600 font-bold">{baseBid}</span>
                            <button
                                onClick={handleViewClick}
                                className="text-sm text-blue-600 font-medium hover:underline"
                            >
                                View Project →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popup */}
            {showPopup && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 px-4"
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby="popup-title"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-80 backdrop-blur-sm"></div>

                    {/* Popup container with fade & scale animation */}
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center
                 animate-fadeInScale"
                    >
                        <p
                            id="popup-title"
                            className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
                        >
                            Welcome to FreelanceHub
                        </p>

                        <button
                            onClick={closePopup}
                            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold
                   shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform duration-150"
                            aria-label="Close welcome popup"
                        >
                            OK
                        </button>
                    </div>

                    {/* Tailwind animation styles - add this to your CSS or tailwind config */}
                    <style>{`
                              @keyframes fadeInScale {
                              0% {
                               opacity: 0;
          transform: scale(0.85);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fadeInScale {
        animation: fadeInScale 0.3s ease forwards;
      }
    `}</style>
                </div>
            )}
        </section>
    );
};

export default FeaturedProject;