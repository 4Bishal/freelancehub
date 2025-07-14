import React from "react";
import { Routes, Route } from "react-router";
import Home from './pages/HomePage/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from "./pages/NotFound";
import MyBids from "./pages/MyBids";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import PostProject from "./pages/PostProject";
import ProjectDetail from "./pages/ProjectDetail";
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import BrowseProjects from "./pages/BrowseProjects";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stays at top */}
      <Navbar />

      {/* Main content grows to fill available space */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/mybids"
            element={
              <ProtectedRoute role="freelancer">
                <MyBids />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientdashboard"
            element={
              // <ProtectedRoute role="client">
              <ClientDashboard />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/freelancerdashboard"
            element={
              // <ProtectedRoute role="freelancer">
              <FreelancerDashboard />
              //  </ProtectedRoute> 
            }
          />
          <Route
            path="/postproject"
            element={
              // <ProtectedRoute role="client">
              <PostProject />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/projectdetail"
            element={
              // <ProtectedRoute role="freelancer">
              <ProjectDetail />
              //  </ProtectedRoute> 
            }
          />
          <Route
            path="/browseprojects"
            element={
              // <ProtectedRoute role="freelancer">
              <BrowseProjects />
              //  </ProtectedRoute> 
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer sticks to bottom if content is short */}
      <Footer />
    </div>
  );
}

export default App;
