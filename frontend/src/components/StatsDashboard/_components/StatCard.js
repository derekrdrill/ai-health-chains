import React from "react";

const StatCard = ({ label, value, accent }) => (
  <div className={`stat-card ${accent || ""}`}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value.toLocaleString()}</div>
    <div className="stat-description">
      {accent === "primary"
        ? "Global platform rollup"
        : "Live on-chain and consent activity"}
    </div>
  </div>
);

export default StatCard;
