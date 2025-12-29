import React from 'react';

const StatCard = ({ label, value, accent }) => {
  const hasAccent = accent === 'primary';
  const statDescription = hasAccent
    ? 'Global platform rollup'
    : 'Live on-chain and consent activity';

  return (
    <div className={`stat-card ${accent || ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value.toLocaleString()}</div>
      <div className="stat-description">{statDescription}</div>
    </div>
  );
};

export default StatCard;
