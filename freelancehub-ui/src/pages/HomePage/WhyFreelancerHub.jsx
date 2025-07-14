import React from 'react'
import { ThumbsUp, ShieldCheck, Users, Zap } from "lucide-react";
const WhyFreelancerHub = () => {
    // Why FreelancerHub
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
        <section className="bg-white py-20 px-4 md:px-12 " id="why-freelancerhub">
            <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Why Choose <span className="text-indigo-600">Freelancer<span className="text-blue-600">Hub</span><span className="text-gray-900">?</span></span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    We make freelancing easy, reliable, and transparent for both clients and freelancers.
                </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {features.map(({ title, icon, description }, idx) => (
                    <div
                        key={idx}
                        className="bg-blue-50 p-6 rounded-xl text-center shadow hover:shadow-md transition duration-300"
                    >
                        <div className="flex justify-center mb-4">{icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-600 text-sm">{description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default WhyFreelancerHub