import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className=" flex flex-col lg:flex-row items-center justify-center  from-indigo-50 via-white to-indigo-50 px-6 py-16 space-y-12 lg:space-y-0 lg:space-x-24">
            {/* Left: Illustration */}
            <div className="max-w-md w-full">
                <img
                    src="/PagenotFoundIcon.svg"
                    alt="Page not found illustration"
                    className="w-full h-auto"
                />
            </div>

            {/* Right: Text & Button */}
            <div className="max-w-lg text-center lg:text-left">
                <h1 className="text-5xl font-extrabold text-indigo-700 mb-6">
                    Oops! Page Not Found
                </h1>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    The page you’re looking for doesn’t exist, has been removed, or is temporarily unavailable.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-8 py-3 rounded-md shadow-lg transition"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
