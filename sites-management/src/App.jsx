import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import SiteDetails from "./pages/SiteDetails";
import SitesMap from "./pages/SitesMap";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pt-28">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/sites/:id" element={<SiteDetails />} />
          <Route path="/sitesmap" element={<SitesMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
