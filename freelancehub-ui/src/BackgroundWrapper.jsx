import React from 'react';

const BackgroundWrapper = ({ children }) => {
    return (
        <>
            {/* Global Background Effect */}
            <div
                className="fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 pointer-events-none -z-10"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>
            </div>

            {/* Your app content */}
            {children}
        </>
    );
};

export default BackgroundWrapper;