import { FacebookIcon, LinkedinIcon, GithubIcon } from 'lucide-react';

export default function Footer() {
    return (
        <footer className=" text-gray-800  mt-auto h-24">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
                {/* Logo */}
                <div className="text-3xl font-bold text-indigo-600">
                    Freelance<span className="text-blue-600">Hub</span>
                </div>

                {/* Copyright */}
                <p className="text-sm text-center md:text-left mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} FreelanceHub. All rights reserved.
                </p>

                {/* Social Icons */}
                <div className="flex space-x-6">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="hover:text-blue-600 transform transition-transform duration-300 hover:scale-125"
                    >
                        <FacebookIcon size={20} />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hover:text-blue-500 transform transition-transform duration-300 hover:scale-125"
                    >
                        <LinkedinIcon size={20} />
                    </a>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="hover:text-black transform transition-transform duration-300 hover:scale-125"
                    >
                        <GithubIcon size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
