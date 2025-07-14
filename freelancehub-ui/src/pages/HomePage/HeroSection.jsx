import React from 'react'
import { Link } from "react-router-dom";
const HeroSection = () => {
    return (
        <section className="bg-white-100 py-20 text-center px-4 md:px-0 " id="hero-section">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
                Find the Right Projects or the Perfect Freelancer
            </h1>
            <p className="text-lg md:text-xl max-w-xl mx-auto mb-10 text-gray-700">
                Freelancers post projects with a base bid. Clients bid to win projects.
            </p>

            <div className="flex justify-center gap-6">
                <Link
                    to="/post-project"
                    className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-md font-semibold shadow-md transition"
                >
                    Post Your Project
                </Link>
                <Link
                    to="/projects"
                    className="bg-white border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-md font-semibold shadow-md hover:bg-blue-50 transition"
                >
                    Browse Projects
                </Link>
            </div>
        </section>
    )
}

export default HeroSection