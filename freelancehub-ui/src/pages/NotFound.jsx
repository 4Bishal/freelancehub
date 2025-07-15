import { Link } from "react-router-dom";
import { Ban } from "lucide-react";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center flex-grow px-4 text-gray-800">
            <Ban className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
            <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-center max-w-md mb-6 text-lg">
                Sorry, the page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
