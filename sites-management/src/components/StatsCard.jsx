import React from "react";
import PropTypes from "prop-types";

const StatsCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-cyan-50 rounded-full">
          <Icon className="h-6 w-6 text-telkom-blue" />
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <div
            className={`flex items-center text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
          >
            <span>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="ml-2">from previous month</span>
          </div>
        </div>
      )}
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.shape({
    value: PropTypes.number.isRequired,
    isPositive: PropTypes.bool.isRequired,
  }),
};

export default StatsCard;
