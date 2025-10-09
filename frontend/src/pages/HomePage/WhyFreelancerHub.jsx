import React from 'react'
import { ThumbsUp, ShieldCheck, Users, Zap } from "lucide-react";

const WhyFreelancerHub = () => {
    const features = [
        {
            title: "Trusted Platform",
            icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
            description: "Secure environment for project collaboration and payments.",
        },
        {
            title: "Skilled Freelancers",
            icon: <Users className="w-8 h-8 text-indigo-600" />,
            description: "A growing community of verified and talented freelancers.",
        },
        {
            title: "Fast Bidding",
            icon: <Zap className="w-8 h-8 text-indigo-600" />,
            description: "Get competitive bids quickly and choose what suits your needs.",
        },
        {
            title: "Easy to Use",
            icon: <ThumbsUp className="w-8 h-8 text-indigo-600" />,
            description: "Simple project posting and bid management interface.",
        },
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-12" id="why-freelancerhub">
            <div className="text-center mb-12 sm:mb-14">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 max-w-3xl mx-auto">
                    Why Choose{" "}
                    <span className="text-indigo-600">
                        Freelancer<span className="text-blue-600">Hub</span>
                        <span className="text-gray-900">?</span>
                    </span>
                </h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                    We make freelancing easy, reliable, and transparent for both clients and freelancers.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map(({ title, icon, description }, idx) => (
                    <div
                        key={idx}
                        className="bg-blue-50 p-5 sm:p-6 rounded-xl text-center shadow hover:shadow-md transition duration-300"
                    >
                        <div className="flex justify-center mb-3 sm:mb-4">{icon}</div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyFreelancerHub;
