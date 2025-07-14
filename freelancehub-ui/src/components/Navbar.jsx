import React, { useState } from "react";
import { ChevronDown, User, LogOut, Settings, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const navItems = [
        { name: "Home", to: "/" },
        { name: "Register", to: "/register" },
        { name: "Browse Projects", to: "/viewprojects" },
        { name: "About", to: "/about" },
    ];
    return (
        <nav className="bg-white shadow-md px-64 py-3 flex justify-between items-center h-20">
            {/* Logo */}
            <div>
                <Link to="/" className="text-3xl font-bold text-indigo-600">
                    Freelance<span className="text-blue-600">Hub</span>
                </Link>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex space-x-6 text-gray-700">
                {navItems.map(({ name, to }, idx) => (
                    <Link
                        key={idx}
                        to={to}
                        className="relative group text-base font-medium"
                    >
                        {name}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-600 transition-all group-hover:w-full"></span>
                    </Link>
                ))}
            </div>
            {/* User Avatar + Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                >
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="User"
                        className="w-9 h-9 rounded-full border-2 border-indigo-500"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                        <Link
                            to="/clientdashboard"
                            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                        >
                            <User className="w-4 h-4 mr-2" /> Dashboard
                        </Link>

                        <div className="border-t my-1"></div>
                        <Link
                            to="/login"
                            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                        >
                            <LogIn className="w-4 h-4 mr-2" /> Login
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
