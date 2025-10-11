import React from 'react'
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section className="py-16 px-4 text-center" id="hero-section">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-4 leading-tight">
                Find the Right Projects or the Perfect Freelancer
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-700">
                Freelancers post projects with a base bid. Clients bid to win projects.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Link
                    to="/postproject"
                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-md font-semibold shadow-md transition text-sm sm:text-base"
                >
                    Post Your Project
                </Link>
                <Link
                    to="/browseprojects"
                    className="bg-white border-2 border-blue-700 text-blue-700 px-6 py-3 sm:px-8 sm:py-3 rounded-md font-semibold shadow-md hover:bg-blue-50 transition text-sm sm:text-base"
                >
                    Browse Projects
                </Link>
            </div>
        </section>
    );
};

export default HeroSection;