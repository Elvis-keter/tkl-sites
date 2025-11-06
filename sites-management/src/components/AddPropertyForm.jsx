import React from "react";
import { Save } from "lucide-react";

const AddPropertyForm = ({
  propertyFormData,
  handlePropertyInputChange,
  handlePropertySubmit,
  formSubmitting,
  onCancel,
}) => {
  return (
    <form onSubmit={handlePropertySubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={propertyFormData.title}
            onChange={handlePropertyInputChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="e.g. Plot No. 386/25"
          />
        </div>
        <div>
          <label
            htmlFor="asset_description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Asset Description *
          </label>
          <input
            type="text"
            id="asset_description"
            name="asset_description"
            value={propertyFormData.asset_description}
            onChange={handlePropertyInputChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="e.g. Embakasi Exchange"
          />
        </div>
        <div>
          <label
            htmlFor="plot_size"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Plot Size (acres) *
          </label>
          <input
            type="number"
            step="0.01"
            id="plot_size"
            name="plot_size"
            value={propertyFormData.plot_size}
            onChange={handlePropertyInputChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="e.g. 0.25"
          />
        </div>
        <div>
          <label
            htmlFor="bua"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Building Area (sqm) *
          </label>
          <input
            type="number"
            step="0.01"
            id="bua"
            name="bua"
            value={propertyFormData.bua}
            onChange={handlePropertyInputChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="e.g. 803"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fair_value"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fair Value (KSh '000) *
            </label>
            <input
              type="number"
              id="fair_value"
              name="fair_value"
              value={propertyFormData.fair_value}
              onChange={handlePropertyInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g. 1850"
            />
          </div>
          <div>
            <label
              htmlFor="land"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Land Value (KSh '000) *
            </label>
            <input
              type="number"
              id="land"
              name="land"
              value={propertyFormData.land}
              onChange={handlePropertyInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g. 14600"
            />
          </div>
          <div>
            <label
              htmlFor="improvements"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Improvements (KSh '000) *
            </label>
            <input
              type="number"
              id="improvements"
              name="improvements"
              value={propertyFormData.improvements}
              onChange={handlePropertyInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g. 3900"
            />
          </div>
          <div>
            <label
              htmlFor="total_value"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Total Value (KSh '000) *
            </label>
            <input
              type="number"
              id="total_value"
              name="total_value"
              value={propertyFormData.total_value}
              onChange={handlePropertyInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g. 70633"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 flex items-center ${
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
              Save Property
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddPropertyForm;
