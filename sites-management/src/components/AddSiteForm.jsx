import React, { useState, useEffect } from "react";
import { Plus, Save, AlertCircle } from "lucide-react";
import axios from "axios";
import Constants from "../utils/Constants";

const AddSiteForm = ({
  formData,
  setFormData,
  formSubmitting,
  setFormSubmitting,
  formSuccess,
  formError,
  handleSubmit,
  propertiesOptions,
  regionsOptions,
  townsOptions,
  networkOptions,
  powerOptions,
  setShowPropertyModal,
}) => {
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If changing region, reset town
    if (name === "region_id") {
      setFormData((prev) => ({
        ...prev,
        town_id: "",
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked ? "Y" : "",
    });
  };

  // Update filtered towns when region changes
  const getFilteredTowns = () => {
    if (!formData.region_name) return townsOptions;
    const townRegionName = regionsOptions[formData.region_id - 1]?.region_name;
    return townsOptions.filter((town) => town.region_id == townRegionName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form error message */}
      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* Form success message */}
      {formSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          Site added successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Site ID */}
          <div>
            <label
              htmlFor="site_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Site ID *
            </label>
            <input
              type="text"
              id="site_id"
              name="site_id"
              value={formData.site_id}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. 101MS"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. Telephone Exchange"
            />
          </div>

          {/* Region */}
          <div>
            <label
              htmlFor="region_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Region *
            </label>
            <select
              id="region_id"
              name="region_id"
              value={formData.region_id}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Region</option>
              {regionsOptions.map((region) => (
                <option key={region.id} value={region.region_name}>
                  {region.region_name}
                </option>
              ))}
            </select>
          </div>

          {/* Town */}
          <div>
            <label
              htmlFor="town_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Town *
            </label>
            <select
              id="town_id"
              name="town_id"
              value={formData.town_id}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={!formData.region_id}
            >
              <option value="">Select Town</option>
              {getFilteredTowns().map((town) => (
                <option key={town.id} value={town.town_name}>
                  {town.town_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {/* Property */}
          <div>
            <label
              htmlFor="property_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property *
            </label>
            <div className="flex space-x-2">
              <select
                id="property_id"
                name="property_id"
                value={formData.property_id}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Property</option>
                {propertiesOptions.map((property) => (
                  <option key={property.id} value={property.title}>
                    {property.title} - {property.asset_description}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowPropertyModal(true)}
                className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                title="Add new property"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Network */}
          <div>
            <label
              htmlFor="network_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Network *
            </label>
            <select
              id="network_id"
              name="network_id"
              value={formData.network_id}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Network</option>
              {networkOptions.map((network) => (
                <option key={network.id} value={network.network_name}>
                  {network.network_name}
                </option>
              ))}
            </select>
          </div>

          {/* Power */}
          <div>
            <label
              htmlFor="power_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Power *
            </label>
            <select
              id="power_id"
              name="power_id"
              value={formData.power_id}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Power</option>
              {powerOptions.map((power) => (
                <option key={power.id} value={power.main_power}>
                  {power.main_power} ({power.backup_power})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Latitude *
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g. 0.3167"
          />
        </div>
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Longitude *
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g. 37.9333"
          />
        </div>
      </div>

      {/* Status Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Site Status Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Status Description */}
          <div>
            <label
              htmlFor="status_description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status Description
            </label>
            <input
              type="text"
              id="status_description"
              name="status_description"
              value={formData.status_description || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. Fully occupied by TKL & Tenant"
            />
          </div>

          {/* Enroachment Status */}
          <div>
            <label
              htmlFor="enroachment_status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Encroachment Status
            </label>
            <input
              type="text"
              id="enroachment_status"
              name="enroachment_status"
              value={formData.enroachment_status || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Encroachment status"
            />
          </div>

          {/* Ownership Documents */}
          <div>
            <label
              htmlFor="ownership_docs"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ownership Documents
            </label>
            <input
              type="text"
              id="ownership_docs"
              name="ownership_docs"
              value={formData.ownership_docs || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="T, N, or other code"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tkl_shop"
              name="tkl_shop"
              checked={formData.tkl_shop === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label htmlFor="tkl_shop" className="ml-2 text-sm text-gray-700">
              TKL Shop
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="atc_tower"
              name="atc_tower"
              checked={formData.atc_tower === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label htmlFor="atc_tower" className="ml-2 text-sm text-gray-700">
              ATC Tower
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="charged_to_bank"
              name="charged_to_bank"
              checked={formData.charged_to_bank === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label
              htmlFor="charged_to_bank"
              className="ml-2 text-sm text-gray-700"
            >
              Charged to Bank
            </label>
          </div>
          {/* Critical to Enterprise */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="critical_to_enterprise"
              name="critical_to_enterprise"
              checked={formData.critical_to_enterprise === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label
              htmlFor="critical_to_enterprise"
              className="ml-2 text-sm text-gray-700"
            >
              Critical to Enterprise
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="on_sfc_deed"
              name="on_sfc_deed"
              checked={formData.on_sfc_deed === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label htmlFor="on_sfc_deed" className="ml-2 text-sm text-gray-700">
              On SFC Deed
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requested_by_sfc"
              name="requested_by_sfc"
              checked={formData.requested_by_sfc === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label
              htmlFor="requested_by_sfc"
              className="ml-2 text-sm text-gray-700"
            >
              Requested by SFC
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="on_atc_court"
              name="on_atc_court"
              checked={formData.on_atc_court === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label
              htmlFor="on_atc_court"
              className="ml-2 text-sm text-gray-700"
            >
              On ATC Court
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="on_atc_deed"
              name="on_atc_deed"
              checked={formData.on_atc_deed === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label htmlFor="on_atc_deed" className="ml-2 text-sm text-gray-700">
              On ATC Deed
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="wholesale"
              name="wholesale"
              checked={formData.wholesale === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label htmlFor="wholesale" className="ml-2 text-sm text-gray-700">
              Wholesale
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="govt_equp"
              name="govt_equp"
              checked={formData.govt_equp === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label htmlFor="govt_equp" className="ml-2 text-sm text-gray-700">
              Govt Equipment
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="strategic_to_tkl"
              name="strategic_to_tkl"
              checked={formData.strategic_to_tkl === "Y"}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <label
              htmlFor="strategic_to_tkl"
              className="ml-2 text-sm text-gray-700"
            >
              Strategic to TKL
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() =>
            document.dispatchEvent(new CustomEvent("closeSiteModal"))
          }
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center ${
            formSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {formSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Save Site
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddSiteForm;
