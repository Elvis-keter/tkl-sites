import React from "react";
import PropTypes from "prop-types";

const FilterBar = ({ regions, selectedRegion, onRegionChange }) => {
  return (
    <div className="flex space-x-4">
      <select
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        // remove border outline on focus
        className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none"
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
};

FilterBar.propTypes = {
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedRegion: PropTypes.string.isRequired,
  onRegionChange: PropTypes.func.isRequired,
};

export default FilterBar;
