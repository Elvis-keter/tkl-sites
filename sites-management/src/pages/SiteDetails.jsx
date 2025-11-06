import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Radio,
  Zap,
  Building2,
  Info,
  ArrowLeft,
  Clipboard,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import Constants from "../utils/Constants";

const SiteDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState(null);
  const [networkDetails, setNetworkDetails] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [powerDetails, setPowerDetails] = useState(null);
  const [statusDetails, setStatusDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSiteDetails();
  }, [id]);

  async function fetchSiteDetails() {
    setLoading(true);
    setError(null);

    try {
      // Fetch site data
      const siteResponse = await axios.get(`${Constants.getAllSitesUrl}/${id}`);
      if (siteResponse.status === 200) {
        const siteData = siteResponse.data;
        setSite(siteData);

        // Fetch related data using the IDs from the site data
        await Promise.all([
          fetchNetworkDetails(siteData.network_id),
          fetchPropertyDetails(siteData.property_id),
          fetchPowerDetails(siteData.power_id),
          fetchStatusDetails(siteData.status_id),
        ]);
      }
    } catch (error) {
      console.error("Error fetching site data:", error);
      setError("Failed to load site details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchNetworkDetails(networkId) {
    try {
      const response = await axios.get(
        `${Constants.getSitePath}networks/${networkId}`,
      );
      if (response.status === 200) {
        setNetworkDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching network details:", error);
    }
  }

  async function fetchPropertyDetails(propertyId) {
    try {
      // Search for property by title in the properties endpoint
      const response = await axios.get(`${Constants.getSitePath}properties`);
      if (response.status === 200 && Array.isArray(response.data)) {
        const matchedProperty = response.data.find(
          (p) => p.title === propertyId,
        );
        if (matchedProperty) {
          setPropertyDetails(matchedProperty);
        }
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  }

  async function fetchPowerDetails(powerId) {
    try {
      const response = await axios.get(
        `${Constants.getSitePath}power/${powerId}`,
      );
      if (response.status === 200) {
        setPowerDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching power details:", error);
    }
  }

  async function fetchStatusDetails(statusId) {
    try {
      const response = await axios.get(
        `${Constants.getSitePath}status/${statusId}`,
      );
      if (response.status === 200) {
        setStatusDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching status details:", error);
    }
  }

  // Helper function to format status values as Yes/No
  const formatStatusValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (value === "1" || value === "Y" || value === "y") return "Yes";
    if (value === "0" || value === "N" || value === "n") return "No";
    return value;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-xl">Loading site details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-red-500">{error}</p>
        <Link
          to="/sites"
          className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mt-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Sites</span>
        </Link>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-red-500">Site not found</p>
        <Link
          to="/sites"
          className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mt-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Sites</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/sites"
          className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Sites</span>
        </Link>
        <h1 className="ml-1 text-3xl font-bold text-gray-900">
          {site.site_id}
        </h1>
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin className="h-5 w-5 mr-2" />
          <span>
            {site.region_id} - {site.town_id}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-6 w-6 text-cyan-600 mr-2" />
              <h2 className="text-xl font-semibold ml-2">
                Property Information
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Property ID</span>
                <span className="font-medium">{site.property_id}</span>
              </div>

              {propertyDetails ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Title</span>
                    <span className="font-medium">{propertyDetails.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description</span>
                    <span className="font-medium">
                      {propertyDetails.asset_description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plot Size (acres)</span>
                    <span className="font-medium">
                      {propertyDetails.plot_size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Building Area (sqm)</span>
                    <span className="font-medium">{propertyDetails.bua}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fair Value (KSh '000)</span>
                    <span className="font-medium">
                      {propertyDetails.fair_value}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Land Value (KSh '000)</span>
                    <span className="font-medium">{propertyDetails.land}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Improvements (KSh '000)
                    </span>
                    <span className="font-medium">
                      {propertyDetails.improvements}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Total Value (KSh '000)
                    </span>
                    <span className="font-medium">
                      {propertyDetails.total_value}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 italic">
                  No detailed property information available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Radio className="h-6 w-6 text-cyan-600 mr-2" />
              <h2 className="text-xl font-semibold ml-2">
                Network Configuration
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Network ID</span>
                <span className="font-medium">{site.network_id}</span>
              </div>

              {networkDetails ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network Name</span>
                    <span className="font-medium">
                      {networkDetails.network_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network Equipment</span>
                    <span className="font-medium">
                      {networkDetails.network_equip}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 italic">
                  No detailed network information available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-cyan-600 mr-2" />
              <h2 className="text-xl font-semibold ml-2">
                Power Configuration
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Power ID</span>
                <span className="font-medium">{site.power_id}</span>
              </div>

              {powerDetails ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Main Power</span>
                    <span className="font-medium">
                      {powerDetails.main_power}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Backup Power</span>
                    <span className="font-medium">
                      {powerDetails.backup_power}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 italic">
                  No detailed power information available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-cyan-600 mr-2" />
              <h2 className="text-xl font-semibold ml-2">Location Details</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Description</span>
                <span className="font-medium">{site.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Region</span>
                <span className="font-medium">{site.region_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Town</span>
                <span className="font-medium">{site.town_id}</span>
              </div>
              {site.latitude && site.longitude && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordinates</span>
                  <span className="font-medium">
                    {site.latitude}, {site.longitude}
                  </span>
                </div>
              )}

              {/* Option to view on map if coordinates are available */}
              {site.latitude && site.longitude && (
                <div className="mt-2">
                  <a
                    href={`https://maps.google.com/?q=${site.latitude},${site.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-800 flex items-center"
                  >
                    <span>View on Google Maps</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Site Status - Comprehensive Section */}
      {statusDetails && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Clipboard className="h-6 w-6 text-cyan-600 mr-2" />
              <h2 className="text-xl font-semibold ml-2">Site Status</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 border-b pb-2">
                  General Information
                </h3>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sts ID</span>
                  <span className="font-medium">{site.status_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sts Description</span>
                  <span className="font-medium">
                    {formatStatusValue(statusDetails.status_description)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ownership Docs</span>
                  <span className="font-medium">
                    {formatStatusValue(statusDetails.ownership_docs)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enroachment Status</span>
                  <span className="font-medium">
                    {formatStatusValue(statusDetails.enroachment_status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 border-b pb-2">
                  Towers & Facilities
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ATC Tower</span>
                  {formatStatusValue(statusDetails.atc_tower) === "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.atc_tower) === "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">TKL Shop</span>
                  {formatStatusValue(statusDetails.tkl_shop) === "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.tkl_shop) === "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Wholesale</span>
                  {formatStatusValue(statusDetails.wholesale) === "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.wholesale) === "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Govt Equipment</span>
                  {formatStatusValue(statusDetails.govt_equp) === "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.govt_equp) === "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 border-b pb-2">
                  Strategic Significance
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Critical to Enterprise</span>
                  {formatStatusValue(statusDetails.critical_to_enterprise) ===
                    "Yes" || statusDetails.critical_to_enterprise === "V" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(
                      statusDetails.critical_to_enterprise,
                    ) === "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Strategic to TKL</span>
                  {formatStatusValue(statusDetails.strategic_to_tkl) ===
                  "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.strategic_to_tkl) ===
                    "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 border-b pb-2">
                  Financial Status
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Charged to Bank</span>
                  {formatStatusValue(statusDetails.charged_to_bank) ===
                  "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.charged_to_bank) ===
                    "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 border-b pb-2">
                  SFC & ATC Status
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On SFC Deed</span>
                  {formatStatusValue(statusDetails.on_sfc_deed) === "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.on_sfc_deed) === "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Requested by SFC</span>
                  {formatStatusValue(statusDetails.requested_by_sfc) ===
                  "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.requested_by_sfc) ===
                    "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On ATC Court</span>
                  {formatStatusValue(statusDetails.on_atc_court) === "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.on_atc_court) === "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On ATC Deed</span>
                  {formatStatusValue(statusDetails.on_atc_deed) === "Yes" ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : formatStatusValue(statusDetails.on_atc_deed) === "No" ? (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteDetails;
