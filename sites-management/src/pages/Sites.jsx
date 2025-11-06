import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Radio,
  Zap,
  List,
  Table,
  ArrowDown,
  ArrowUp,
  Plus,
  X,
} from "lucide-react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import AddSiteForm from "../components/AddSiteForm";
import AddPropertyForm from "../components/AddPropertyForm";
import Constants from "../utils/Constants";

const Sites = () => {
  // Existing state
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [regions, setRegions] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [sortField, setSortField] = useState("site_id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Add site modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  // Add property modal state
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyFormData, setPropertyFormData] = useState({
    title: "",
    asset_description: "",
    plot_size: "",
    bua: "",
    fair_value: "",
    land: "",
    improvements: "",
    total_value: "",
  });

  // State for dropdown options
  const [propertiesOptions, setPropertiesOptions] = useState([]);
  const [townsOptions, setTownsOptions] = useState([]);
  const [regionsOptions, setRegionsOptions] = useState([]);
  const [networkOptions, setNetworkOptions] = useState([]);
  const [powerOptions, setPowerOptions] = useState([]);

  // Unified form data for site and status in a single object
  const [formData, setFormData] = useState({
    site_id: "",
    //property_id: "",
    description: "",
    town_id: "",
    region_id: "",
    status_id: "",
    network_id: "",
    power_id: "",
    latitude: "",
    longitude: "",
    // Status fields
    enroachment_status: "",
    critical_to_enterprise: "",
    status_description: "",
    govt_equp: "",
    strategic_to_tkl: "",
    tkl_shop: "",
    atc_tower: "",
    charged_to_bank: "",
    on_sfc_deed: "",
    requested_by_sfc: "",
    on_atc_court: "",
    on_atc_deed: "",
    wholesale: "",
    ownership_docs: "",
  });

  // Effect to fetch sites data
  useEffect(() => {
    fetchAllSites();
  }, []);

  // Effect to extract unique regions for filter
  useEffect(() => {
    if (locations.length > 0) {
      const uniqueRegions = [
        ...new Set(locations.map((site) => site.region_id)),
      ].map((region) => ({ id: region, name: region }));
      setRegions(uniqueRegions);
    }
  }, [locations]);

  // Effect to apply filters
  useEffect(() => {
    if (locations.length > 0) {
      const filtered = locations.filter((site) => {
        const matchesSearch =
          site.site_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.status_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.town_id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion =
          !selectedRegion || site.region_id === selectedRegion;

        return matchesSearch && matchesRegion;
      });

      setFilteredLocations(filtered);
    }
  }, [searchQuery, selectedRegion, locations]);

  // Effect to apply sorting
  useEffect(() => {
    if (filteredLocations.length > 0) {
      const sorted = [...filteredLocations].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === b[sortField]) return 0;

        const comparison = a[sortField]
          .toString()
          .localeCompare(b[sortField].toString(), undefined, {
            numeric: true,
            sensitivity: "base",
          });
        return sortDirection === "asc" ? comparison : -comparison;
      });

      setFilteredLocations(sorted);
    }
  }, [sortField, sortDirection]);

  // Effect to load dropdown data when modal opens
  useEffect(() => {
    if (showAddModal) {
      fetchDropdownData();
    }
  }, [showAddModal]);

  // Listen for custom event to close modal
  useEffect(() => {
    const handleCloseModal = () => setShowAddModal(false);
    document.addEventListener("closeSiteModal", handleCloseModal);
    return () => {
      document.removeEventListener("closeSiteModal", handleCloseModal);
    };
  }, []);

  // Function to fetch all sites data
  function fetchAllSites() {
    async function fetchData() {
      try {
        const response = await axios.get(Constants.getAllSitesUrl);
        if (response.status === 200) {
          const data = response.data;
          if (data && Array.isArray(data)) {
            console.log("Sites data : ", data.length);
            setLocations(data);
            setFilteredLocations(data);
            setDataFetched(true);
          } else {
            console.error("Received data is not an array:", data);
          }
        } else {
          console.error("Failed to fetch sites data");
        }
      } catch (error) {
        console.error("Error fetching sites data:", error);
      }
    }
    fetchData();
  }

  // Function to fetch all dropdown data
  async function fetchDropdownData() {
    try {
      // Fetch properties
      const propertiesResponse = await axios.get(
        `${Constants.getSitePath}properties`,
      );
      if (
        propertiesResponse.status === 200 &&
        Array.isArray(propertiesResponse.data)
      ) {
        setPropertiesOptions(propertiesResponse.data);
      }

      // Fetch regions
      const regionsResponse = await axios.get(
        `${Constants.getSitePath}regions`,
      );
      if (
        regionsResponse.status === 200 &&
        Array.isArray(regionsResponse.data)
      ) {
        setRegionsOptions(regionsResponse.data);
      }

      // Fetch towns
      const townsResponse = await axios.get(`${Constants.getSitePath}towns`);
      if (townsResponse.status === 200 && Array.isArray(townsResponse.data)) {
        setTownsOptions(townsResponse.data);
      }

      // Fetch network options
      const networkResponse = await axios.get(
        `${Constants.getSitePath}networks`,
      );
      if (
        networkResponse.status === 200 &&
        Array.isArray(networkResponse.data)
      ) {
        setNetworkOptions(networkResponse.data);
      }

      // Fetch power options
      const powerResponse = await axios.get(`${Constants.getSitePath}power`);
      if (powerResponse.status === 200 && Array.isArray(powerResponse.data)) {
        setPowerOptions(powerResponse.data);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setFormError("Failed to load form data. Please try again.");
    }
  }

  // Handle property form input changes
  const handlePropertyInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyFormData({
      ...propertyFormData,
      [name]: value,
    });
  };

  // Handle property form submission
  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const response = await axios.post(
        `${Constants.getSitePath}properties/new`,
        propertyFormData,
      );
      if (response.status === 200 || response.status === 201) {
        // Refresh properties options
        const propertiesResponse = await axios.get(
          `${Constants.getSitePath}properties`,
        );
        if (
          propertiesResponse.status === 200 &&
          Array.isArray(propertiesResponse.data)
        ) {
          setPropertiesOptions(propertiesResponse.data);

          // Set the newly created property as selected
          const newProperty = propertiesResponse.data.find(
            (p) => p.title === propertyFormData.title,
          );
          if (newProperty) {
            setFormData({
              ...formData,
              status_id: newProperty.id,
            });
          }
        }

        // Close property modal
        setShowPropertyModal(false);

        // Reset property form
        setPropertyFormData({
          title: "",
          asset_description: "",
          plot_size: "",
          bua: "",
          fair_value: "",
          land: "",
          improvements: "",
          total_value: "",
        });
      }
    } catch (error) {
      console.error("Error creating property:", error);
      setFormError("Failed to create property. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle form submission - Updated for combined endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    // Check if all required fields are filled
    const requiredFields = [
      "site_id",
      "description",
      "town_id",
      "region_id",
      "network_id",
      "power_id",
      "latitude",
      "longitude",
      //"status_id",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setFormError(
        `Please fill all required fields: ${missingFields.join(", ")}`,
      );
      setFormSubmitting(false);
      return;
    }

    try {
      // Use the combined payload directly - all data is in formData now
      const response = await axios.post(Constants.postSitesUrl, formData);
      console.log("Response from server:", response);
      if (response.status === 200 || response.status === 201) {
        console.log("Site added successfully:", response.data);
        setFormSuccess(true);
        setTimeout(() => {
          setShowAddModal(false);
          setFormSuccess(false);
          // Refresh sites data
          fetchAllSites();

          // Reset form
          setFormData({
            site_id: "",
            //property_id: "",
            description: "",
            town_id: "",
            region_id: "",
            status_id: "",
            network_id: "",
            power_id: "",
            latitude: "",
            longitude: "",
            // Reset status fields
            enroachment_status: "",
            critical_to_enterprise: "",
            status_description: "",
            govt_equp: "",
            strategic_to_tkl: "",
            tkl_shop: "",
            atc_tower: "",
            charged_to_bank: "",
            on_sfc_deed: "",
            requested_by_sfc: "",
            on_atc_court: "",
            on_atc_deed: "",
            wholesale: "",
            ownership_docs: "",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(
        // error.response?.data?.message ||
        "Failed to add site. Please try again.",
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Function to render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 inline" />
    );
  };

  // Render list view
  const renderListView = () => (
    <div className="grid gap-6">
      {filteredLocations.map((site) => (
        <Link
          key={site.id}
          to={`/sites/${site.id}`}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {site.site_id}
              </h2>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {site.region_id} - {site.town_id}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{site.description}</p>
              <p className="mt-1 text-sm text-gray-500">{site.status_id}</p>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <Radio className="h-5 w-5 text-telkom-blue mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {site.network_id}
                </span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {site.power_id}
                </span>
              </div>
            </div>
          </div>
          {site.latitude && site.longitude && (
            <div className="mt-2 text-xs text-gray-500">
              Coordinates: {site.latitude}, {site.longitude}
            </div>
          )}
        </Link>
      ))}
    </div>
  );

  // Render table view
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("site_id")}
            >
              Site ID {renderSortIndicator("site_id")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("description")}
            >
              Description {renderSortIndicator("description")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("region_id")}
            >
              Region {renderSortIndicator("region_id")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("town_id")}
            >
              Town {renderSortIndicator("town_id")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("network_id")}
            >
              Network Status {renderSortIndicator("network_id")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("power_id")}
            >
              Power {renderSortIndicator("power_id")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("latitude")}
            >
              Coordinates {renderSortIndicator("latitude")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLocations.map((site) => (
            <tr
              key={site.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => (window.location.href = `/sites/${site.id}`)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {site.site_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {site.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {site.region_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {site.town_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <Radio className="h-4 w-4 text-telkom-blue mr-2" />
                  {site.network_id}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                  {site.power_id}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {site.latitude && site.longitude
                  ? `${site.latitude}, ${site.longitude}`
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Sort options for dropdown
  const sortOptions = [
    { value: "site_id", label: "Site ID" },
    { value: "region_id", label: "Region" },
    { value: "town_id", label: "Town" },
    { value: "description", label: "Description" },
    { value: "network_id", label: "Network Status" },
    { value: "power_id", label: "Power Status" },
  ];

  // Modal for adding a new property
  const renderAddPropertyModal = () => (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setShowPropertyModal(false)}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Property
              </h2>
              <button
                onClick={() => setShowPropertyModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <AddPropertyForm
              propertyFormData={propertyFormData}
              handlePropertyInputChange={handlePropertyInputChange}
              handlePropertySubmit={handlePropertySubmit}
              formSubmitting={formSubmitting}
              onCancel={() => setShowPropertyModal(false)}
            />
          </div>
        </div>
      </div>
    </>
  );

  // Modal for adding a new site
  const renderAddModal = () => (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setShowAddModal(false)}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 mt-28">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Site</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <AddSiteForm
              formData={formData}
              setFormData={setFormData}
              formSubmitting={formSubmitting}
              setFormSubmitting={setFormSubmitting}
              formSuccess={formSuccess}
              formError={formError}
              handleSubmit={handleSubmit}
              propertiesOptions={propertiesOptions}
              regionsOptions={regionsOptions}
              townsOptions={townsOptions}
              networkOptions={networkOptions}
              powerOptions={powerOptions}
              setShowPropertyModal={setShowPropertyModal}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sites</h1>

        {/* View toggle buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-2 py-2 text-white bg-cyan-600 rounded-md shadow hover:bg-cyan-700 focus:outline-none focus:ring-transparent focus:ring-cyan-500 focus:border-cyan-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Site
          </button>

          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md flex items-center ${
                viewMode === "list"
                  ? "bg-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="List view"
              title="List view"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md flex items-center ${
                viewMode === "table"
                  ? "bg-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Table view"
              title="Table view"
            >
              <Table className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex gap-2">
            {/* <FilterBar */}
            {/*   regions={regions} */}
            {/*   selectedRegion={selectedRegion} */}
            {/*   onRegionChange={setSelectedRegion} */}
            {/* /> */}

            {/* Sort dropdown */}
            <div className="relative">
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium text-gray-600">
                  Sort by:
                </label>
                <select
                  className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  value={sortField}
                  onChange={(e) => {
                    setSortField(e.target.value);
                    setSortDirection("asc");
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  className="ml-2 p-2 rounded-md hover:bg-gray-100"
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                  title={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
                >
                  {sortDirection === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!dataFetched ? (
        <div className="text-center py-10">Loading sites data...</div>
      ) : filteredLocations.length === 0 ? (
        <div className="text-center py-10">
          No sites match your search criteria
        </div>
      ) : /* Render view based on selected viewMode */
      viewMode === "list" ? (
        renderListView()
      ) : (
        renderTableView()
      )}

      {/* Add Site Modal */}
      {showAddModal && renderAddModal()}

      {/* Add Property Modal */}
      {showPropertyModal && renderAddPropertyModal()}
    </div>
  );
};

export default Sites;
