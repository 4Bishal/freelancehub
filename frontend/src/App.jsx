import React from "react";
import { Routes, Route } from "react-router-dom";  // use react-router-dom instead of react-router
import Home from './pages/HomePage/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import PostProject from "./pages/PostProject";
import EditProject from "./pages/EditProject";
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import BrowseProjects from "./pages/BrowseProjects";
import MakeBid from "./pages/MakeBid";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectBids from "./pages/ProjectBids";
import PublicRoute from "./components/PublicRoute";

function App() {
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

      {/* Main App Content */}
      <div className="flex flex-col min-h-screen relative">
        {/* Navbar stays at top */}
        <Navbar />

        {/* Main content grows to fill available space */}
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            {/* Public routes only for NOT authenticated users */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<NotFound />} />

            {/* Protected Routes */}

            {/* Freelancer only */}
            <Route
              path="/freelancerdashboard"
              element={
                <ProtectedRoute allowedRoles={["freelancer"]}>
                  <FreelancerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/makebid/:id"
              element={
                <ProtectedRoute allowedRoles={["freelancer"]}>
                  <MakeBid />
                </ProtectedRoute>
              }
            />
            <Route
              path="/browseprojects"
              element={
                <ProtectedRoute allowedRoles={["freelancer"]}>
                  <BrowseProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projectdetail/:id"
              element={
                <ProtectedRoute allowedRoles={["freelancer"]}>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />

            {/* Client only */}
            <Route
              path="/clientdashboard"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editproject/:id"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <EditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/postproject"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PostProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projectbids/:id"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <ProjectBids />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer sticks to bottom if content is short */}
        <Footer />
      </div>
    </>
  );
}

export default App;