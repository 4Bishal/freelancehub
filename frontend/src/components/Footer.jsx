import { FacebookIcon, LinkedinIcon, GithubIcon } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white text-gray-800 mt-auto border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* Logo */}
                <div className="text-3xl font-bold text-indigo-600">
                    Freelance<span className="text-blue-600">Hub</span>
                </div>

                {/* Copyright & Built By */}
                <p className="text-sm text-center md:text-left text-gray-600">
                    &copy; {new Date().getFullYear()} FreelanceHub. All rights reserved. — Built by{" "}
                    <a
                        href="https://www.bhandari-bishal.com.np"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Bishal Bhandari
                    </a>
                </p>

                {/* Social Icons */}
                <div className="flex space-x-5">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="hover:text-blue-600 transition-transform duration-300 hover:scale-110"
                    >
                        <FacebookIcon size={20} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/bishal-bhandari-a63b8926a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hover:text-blue-500 transition-transform duration-300 hover:scale-110"
                    >
                        <LinkedinIcon size={20} />
                    </a>
                    <a
                        href="https://github.com/4Bishal"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="hover:text-black transition-transform duration-300 hover:scale-110"
                    >
                        <GithubIcon size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
