import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { toast } from "react-toastify";

export default function Navbar() {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, role, username, logout } = useAuth();

    useEffect(() => {
        setDropdownOpen(false);
        setMobileMenuOpen(false); // close menu on route change
    }, [location]);

    const avatarSrc =
        role === "client"
            ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            : role === "freelancer"
                ? "https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
                : "https://i.pravatar.cc/40";

    const roleDisplay = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

    const publicNavItems = [
        { name: "Home", to: "/" },
        { name: "About", to: "/about" },
    ];

    const authNavItems = !isAuthenticated
        ? [
            { name: "Register", to: "/register" },
            { name: "Login", to: "/login" },
        ]
        : [];

    const protectedNavItems = [];

    if (isAuthenticated && role === "freelancer") {
        protectedNavItems.push({ name: "Browse Projects", to: "/browseprojects" });
    }

    const allNavItems = [...publicNavItems, ...protectedNavItems, ...authNavItems];

    const getDashboardLink = () => {
        if (role === "client") return "/clientdashboard";
        if (role === "freelancer") return "/freelancerdashboard";
        return "/";
    };

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            toast.success("Logout successful");
            navigate("/");  // Navigate to home after logout success
        } else {
            toast.error("Logout failed, please try again");
        }
        setDropdownOpen(false);
    };

    return (
        <nav className="px-4 md:px-16 lg:px-32 py-3 flex justify-between items-center h-20 relative bg-white shadow sticky top-0 z-50">
            {/* Logo */}
            <div>
                <Link to="/" className="text-3xl font-bold text-indigo-600">
                    Freelance<span className="text-blue-600">Hub</span>
                </Link>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex space-x-6 text-gray-700">
                {allNavItems.map(({ name, to }, idx) => (
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

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
                <button
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-gray-600 focus:outline-none"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* User Avatar and Dropdown */}
            {isAuthenticated && (
                <div className="hidden md:flex relative items-center space-x-3">
                    <span className="text-gray-700 font-semibold hidden lg:inline">
                        Role: {roleDisplay}
                    </span>
                    <button
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none relative"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        <img
                            src={avatarSrc}
                            alt="User Avatar"
                            className="w-9 h-9 rounded-full border-2 border-indigo-500 object-cover"
                        />
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                            {/* Username with icon */}
                            <div className="flex items-center px-4 py-2 border-b text-gray-800 text-sm">
                                <User className="w-4 h-4 mr-2 text-indigo-600" />
                                <span className="font-semibold">Hi , {username}</span>
                            </div>

                            {/* Dashboard link */}
                            <Link
                                to={getDashboardLink()}
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                            </Link>

                            {/* Client-only link */}
                            {role === "client" && (
                                <Link
                                    to="/postproject"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                >
                                    <User className="w-4 h-4 mr-2" /> Post Project
                                </Link>
                            )}

                            <div className="border-t my-1"></div>

                            {/* Logout button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </button>
                        </div>
                    )}


                </div>
            )}

            {/* Mobile Menu Panel */}
            {isMobileMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-white shadow-lg border-t z-40 md:hidden">
                    <div className="flex flex-col px-6 py-4 space-y-3 text-gray-800">
                        {allNavItems.map(({ name, to }, idx) => (
                            <Link
                                key={idx}
                                to={to}
                                className="text-base font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {name}
                            </Link>
                        ))}

                        {isAuthenticated && (
                            <>
                                <hr />
                                <span className="text-sm text-gray-600 mb-2">
                                    Role: {roleDisplay}
                                </span>
                                <Link
                                    to={getDashboardLink()}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center text-sm text-gray-700"
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                </Link>
                                {role === "client" && (
                                    <Link
                                        to="/postproject"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center text-sm text-gray-700"
                                    >
                                        <User className="w-4 h-4 mr-2" /> Post Project
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-sm text-red-600 mt-2"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}