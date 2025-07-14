import React from 'react'
import { Hammer, Search, Handshake, CheckCircle } from "lucide-react";
const HowItWorks = () => {
    // Home - How it works Section
    const steps = [
        {
            title: "Post Your Project",
            description: "Freelancers describe their project, set a base bid, and publish it.",
            icon: <Hammer className="w-8 h-8 text-indigo-600" />,
        },
        {
            title: "Clients Bid",
            description: "Clients browse available projects and place competitive bids.",
            icon: <Search className="w-8 h-8 text-indigo-600" />,
        },
        {
            title: "Accept the Best Offer",
            description: "Freelancers review bids and accept the most suitable client.",
            icon: <Handshake className="w-8 h-8 text-indigo-600" />,
        },
        {
            title: "Complete & Get Paid",
            description: "Deliver the work and receive payment securely through the platform.",
            icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
        },
    ];
    return (
        <section id="how-it-works" className="bg-white py-20 px-4 md:px-12 ">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    How It Works
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    A simple 4-step process to connect freelancers and clients efficiently.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition duration-300 text-center"
                    >
                        <div className="flex justify-center mb-4">{step.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default HowItWorks