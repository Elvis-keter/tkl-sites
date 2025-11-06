import React, { useState, useEffect } from "react";
import { Building2, MapPin, Radio, Zap } from "lucide-react";
import StatsCard from "../components/StatsCard";
import axios from "axios";
import Constants from "../utils/Constants";

const Dashboard = () => {
  const [countSites, setCountSites] = useState(0);

  useEffect(() => {
    async function fetchSiteCount() {
      try {
        const response = await axios.get(`${Constants.getSitePath}count-sites`);
        setCountSites(response.data.totalSites);
        console.log("Fetched site count:", response.data.totalSites);
      } catch (error) {
        console.error("Error fetching site count:", error);
      }
    }
    fetchSiteCount();
  }, []);     

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Building2 className="mr-4 h-8 w-8 text-telkom-blue" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sites"
          value={countSites}
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard title="Regions" value={47} icon={MapPin} />
        <StatsCard
          title="Network Coverage"
          value="92%"
          icon={Radio}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Power Status"
          value="98%"
          icon={Zap}
          trend={{ value: 1, isPositive: true }}
        />
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Sites
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">Site {i}</p>
                  <p className="text-sm text-gray-500">Region {i}</p>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Status Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Critical Sites</span>
              <span className="font-medium text-gray-900">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Maintenance Required</span>
              <span className="font-medium text-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Power Issues</span>
              <span className="font-medium text-gray-900">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
