import React from 'react';
import PropTypes from 'prop-types';

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

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  accent: PropTypes.string,
};

export default StatCard;
