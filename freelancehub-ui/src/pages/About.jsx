import React, { useState } from "react";

export default function About() {
    const [contactData, setContactData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setContactData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log("Contact form submitted:", contactData);
        alert("Thank you for reaching out! We'll get back to you soon.");
        setContactData({ name: "", email: "", message: "" });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl p-8 sm:p-10 rounded-2xl shadow-2xl w-full ">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-indigo-600 text-center">
                    About FreelancerHub
                </h1>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                    FreelancerHub is a dedicated platform connecting talented freelancers with clients
                    around the world. Our mission is to empower individuals to find meaningful projects,
                    collaborate efficiently, and build lasting professional relationships.
                </p>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                    Whether you’re a freelancer looking for exciting opportunities or a client seeking
                    expert professionals, FreelancerHub provides a seamless experience tailored to your needs.
                    We value trust, quality, and transparency in every project.
                </p>

                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-indigo-600">
                    Why Choose FreelancerHub?
                </h2>

                <ul className="list-disc list-inside space-y-3 text-gray-700 text-base sm:text-lg mb-8">
                    <li>Robust and secure platform with easy-to-use tools</li>
                    <li>Wide range of freelancers and clients from diverse industries</li>
                    <li>Verified profiles and transparent reviews</li>
                    <li>Dedicated support to ensure smooth project delivery</li>
                    <li>Competitive pricing and flexible contract options</li>
                </ul>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-10">
                    Join FreelancerHub today and take your freelancing or project hiring to the next level.
                    Together, let’s create success stories that matter.
                </p>

                {/* Contact Section */}
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-indigo-600 text-center">
                    Contact Us
                </h2>

                <form onSubmit={handleContactSubmit} className="space-y-6 max-w-xl mx-auto">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                        value={contactData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        required
                        value={contactData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        required
                        rows={5}
                        value={contactData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    ></textarea>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition text-base sm:text-lg"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
