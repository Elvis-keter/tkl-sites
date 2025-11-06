import React from "react";
import { Link } from "react-router-dom";
import { Building2, Map, Radio, Power, Home } from "lucide-react";

const Navbar = () => {
  return (
    <nav
      className="bg-white shadow-lg p-4 fixed top-0 left-0 right-0 w-full"
      style={{ zIndex: 1001 }}
    >
      <div className="max-w-7xl mx-auto px-0 md:px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <div className="items-center">
                <img
                  src="/telkom-2.svg"
                  alt="Logo"
                  className="h-14 mb-4 w-auto"
                />
              </div>
            </Link>
          </div>

          <div className="flex space-x-8">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-telkom-blue"
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/sites"
              className="flex items-center text-gray-700 hover:text-telkom-blue"
            >
              <Map className="h-5 w-5 mr-2" />
              <span>Site List</span>
            </Link>
            <Link
              to="/sitesmap"
              className="flex items-center text-gray-700 hover:text-telkom-blue"
            >
              <Radio className="h-5 w-5 mr-2" />
              <span>Site Map</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
