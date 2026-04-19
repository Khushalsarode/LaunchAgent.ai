import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout & Utility
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProjectChatbot from "./components/ProjectChatbot";
import BackToTop from "./utility/BackToTop";

// Page Components
import Home from "./components/Home";
import About from "./components/About";
import Pricing from "./components/Pricing";
import Dashboard from "./components/Dashboard";

// Feature Components
import DomainAI from "./features/DomainAI";
import DomainStatus from "./features/DomainStatus";
import UserBookmarks from "./features/UserBookmarks";

// Core & User Components
import Workspace from "./core/Workspace";
import OriginVerifier from "./core/OriginVerifier";
import PromptHistory from "./core/PromptHistory";
import UserProfile from "./user/UserProfile";
import UserDashboard from "./user/UserDashboard";
import Settings from "./user/Settings";

function App() {
  // activeProject remains for the Workspace logic
  const [activeProject, setActiveProject] = useState(null);

  return (
    <Router>
      <div className="bg-slate-950 text-slate-200 min-h-screen flex flex-col">
        <Navbar />

        <div className="pt-24 flex-grow">
          <Routes>
            {/* General Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Dashboard & User Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/dashboardh" element={<Dashboard />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/prompthistory" element={<PromptHistory />} />

            {/* Feature Routes */}
            <Route path="/domainai" element={<DomainAI />} />
            <Route path="/status" element={<DomainStatus />} />
            <Route path="/bookmarks" element={<UserBookmarks />} />

            {/* Core Logic Routes */}
            {/* Workspace keeps state to manage the current session */}
            <Route
              path="/workspace"
              element={<Workspace project={activeProject} setProject={setActiveProject} />}
            />

            {/* OriginVerifier is now independent - no props needed! */}
            <Route
              path="/verification"
              element={<OriginVerifier />}
            />
          </Routes>
        </div>

        <ProjectChatbot />
        <BackToTop />
        <Footer />
      </div>
    </Router>
  );
}

export default App;