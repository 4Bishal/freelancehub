import React from "react";
import { Link } from "react-router-dom";
import { Hammer, Search, Handshake, CheckCircle, ThumbsUp, ShieldCheck, Users, Zap } from "lucide-react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import FeaturedProject from "./FeaturedProject";
import WhyFreelancerHub from "./WhyFreelancerHub";


const Home = () => {

    return (
        <>
            <HeroSection />
            <HowItWorks />
            <FeaturedProject />
            <WhyFreelancerHub />
        </>
    )

    // // Home - How it works Section
    // const steps = [
    //     {
    //         title: "Post Your Project",
    //         description: "Freelancers describe their project, set a base bid, and publish it.",
    //         icon: <Hammer className="w-8 h-8 text-indigo-600" />,
    //     },
    //     {
    //         title: "Clients Bid",
    //         description: "Clients browse available projects and place competitive bids.",
    //         icon: <Search className="w-8 h-8 text-indigo-600" />,
    //     },
    //     {
    //         title: "Accept the Best Offer",
    //         description: "Freelancers review bids and accept the most suitable client.",
    //         icon: <Handshake className="w-8 h-8 text-indigo-600" />,
    //     },
    //     {
    //         title: "Complete & Get Paid",
    //         description: "Deliver the work and receive payment securely through the platform.",
    //         icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
    //     },
    // ];

    // // Featured Projects
    // const projects = [
    //     {
    //         id: 1,
    //         title: "Build a Portfolio Website",
    //         description: "Looking for a responsive personal portfolio site with animations.",
    //         baseBid: "$50",
    //         tag: "Web Development",
    //     },
    //     {
    //         id: 2,
    //         title: "Design a Mobile App UI",
    //         description: "Need a clean UI for a finance tracking app in Figma.",
    //         baseBid: "$80",
    //         tag: "UI/UX Design",
    //     },
    //     {
    //         id: 3,
    //         title: "Create Social Media Ads",
    //         description: "Ad creatives for a product launch campaign. 3-5 images.",
    //         baseBid: "$40",
    //         tag: "Graphic Design",
    //     },
    // ];
    // // Why FreelancerHub
    // const features = [
    //     {
    //         title: "Trusted Platform",
    //         icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
    //         description: "Secure environment for project collaboration and payments.",
    //     },
    //     {
    //         title: "Skilled Freelancers",
    //         icon: <Users className="w-8 h-8 text-indigo-600" />,
    //         description: "A growing community of verified and talented freelancers.",
    //     },
    //     {
    //         title: "Fast Bidding",
    //         icon: <Zap className="w-8 h-8 text-indigo-600" />,
    //         description: "Get competitive bids quickly and choose what suits your needs.",
    //     },
    //     {
    //         title: "Easy to Use",
    //         icon: <ThumbsUp className="w-8 h-8 text-indigo-600" />,
    //         description: "Simple project posting and bid management interface.",
    //     },
    // ];
    // return (
    //     <div className="main">
    //         <section className="bg-white-100 py-20 text-center px-4 md:px-0 " id="hero-section">
    //             <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
    //                 Find the Right Projects or the Perfect Freelancer
    //             </h1>
    //             <p className="text-lg md:text-xl max-w-xl mx-auto mb-10 text-gray-700">
    //                 Freelancers post projects with a base bid. Clients bid to win projects.
    //             </p>

    //             <div className="flex justify-center gap-6">
    //                 <Link
    //                     to="/post-project"
    //                     className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-md font-semibold shadow-md transition"
    //                 >
    //                     Post Your Project
    //                 </Link>
    //                 <Link
    //                     to="/projects"
    //                     className="bg-white border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-md font-semibold shadow-md hover:bg-blue-50 transition"
    //                 >
    //                     Browse Projects
    //                 </Link>
    //             </div>
    //         </section>
    //         <section id="how-it-works" className="bg-white py-20 px-4 md:px-12 ">
    //             <div className="text-center mb-16">
    //                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    //                     How It Works
    //                 </h2>
    //                 <p className="text-gray-600 text-lg max-w-2xl mx-auto">
    //                     A simple 4-step process to connect freelancers and clients efficiently.
    //                 </p>
    //             </div>

    //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
    //                 {steps.map((step, idx) => (
    //                     <div
    //                         key={idx}
    //                         className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition duration-300 text-center"
    //                     >
    //                         <div className="flex justify-center mb-4">{step.icon}</div>
    //                         <h3 className="text-xl font-semibold text-gray-800 mb-2">
    //                             {step.title}
    //                         </h3>
    //                         <p className="text-gray-600 text-sm">{step.description}</p>
    //                     </div>
    //                 ))}
    //             </div>
    //         </section>
    //         <section className="py-20 px-4 md:px-12 bg-white-50 " id="featured-project">
    //             <div className="text-center mb-12">
    //                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
    //                     Featured Projects
    //                 </h2>
    //                 <p className="text-gray-600 text-lg max-w-2xl mx-auto">
    //                     Browse active projects freelancers have posted and start bidding!
    //                 </p>
    //             </div>

    //             <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    //                 {projects.map(({ id, title, description, baseBid, tag }) => (
    //                     <div
    //                         key={id}
    //                         className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition"
    //                     >
    //                         <h3 className="text-xl font-semibold text-gray-800 mb-2">
    //                             {title}
    //                         </h3>
    //                         <p className="text-sm text-gray-600 mb-4 line-clamp-3">
    //                             {description}
    //                         </p>
    //                         <div className="text-sm text-gray-500 mb-2">
    //                             <span className="font-medium text-gray-700">Category:</span> {tag}
    //                         </div>
    //                         <div className="flex items-center justify-between mt-4">
    //                             <span className="text-indigo-600 font-bold">{baseBid}</span>
    //                             <Link
    //                                 to={`/projects/${id}`}
    //                                 className="text-sm text-blue-600 font-medium hover:underline"
    //                             >
    //                                 View Project →
    //                             </Link>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>

    //         </section>
    //         <section className="bg-white py-20 px-4 md:px-12 " id="why-freelancerhub">
    //             <div className="text-center mb-14">
    //                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    //                     Why Choose <span className="text-indigo-600">Freelancer<span className="text-blue-600">Hub</span><span className="text-gray-900">?</span></span>
    //                 </h2>
    //                 <p className="text-gray-600 max-w-2xl mx-auto text-lg">
    //                     We make freelancing easy, reliable, and transparent for both clients and freelancers.
    //                 </p>
    //             </div>

    //             <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
    //                 {features.map(({ title, icon, description }, idx) => (
    //                     <div
    //                         key={idx}
    //                         className="bg-blue-50 p-6 rounded-xl text-center shadow hover:shadow-md transition duration-300"
    //                     >
    //                         <div className="flex justify-center mb-4">{icon}</div>
    //                         <h3 className="text-xl font-semibold text-gray-800 mb-2">
    //                             {title}
    //                         </h3>
    //                         <p className="text-gray-600 text-sm">{description}</p>
    //                     </div>
    //                 ))}
    //             </div>
    //         </section>
    //     </div>
    // )
}

export default Home