import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hammer, Search, Handshake, CheckCircle, ThumbsUp, ShieldCheck, Users, Zap } from "lucide-react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import FeaturedProject from "./FeaturedProject";
import WhyFreelancerHub from "./WhyFreelancerHub";
import { toast, ToastContainer } from "react-toastify";
import useRedirectedToast from "../../hooks/useRedirectedToast";

const Home = () => {
    useRedirectedToast();

    return (
        <>

            <HeroSection />
            <HowItWorks />
            <FeaturedProject />
            <WhyFreelancerHub />
            <ToastContainer />
        </>
    )
}

export default Home