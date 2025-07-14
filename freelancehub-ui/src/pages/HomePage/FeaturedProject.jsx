import React from 'react'
import { Link } from "react-router-dom";

const FeaturedProject = () => {
    // Featured Projects
    const projects = [
        {
            id: 1,
            title: "Build a Portfolio Website",
            description: "Looking for a responsive personal portfolio site with animations.",
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
    return (
        <section className="py-20 px-4 md:px-12 bg-white-50 " id="featured-project">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Featured Projects
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Browse active projects freelancers have posted and start bidding!
                </p>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(({ id, title, description, baseBid, tag }) => (
                    <div
                        key={id}
                        className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
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
                            <Link
                                to={`/projects/${id}`}
                                className="text-sm text-blue-600 font-medium hover:underline"
                            >
                                View Project →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    )
}

export default FeaturedProject