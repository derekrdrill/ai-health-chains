import React, { useState, useEffect } from 'react';
import './StatsDashboard.css';
import { apiService } from '../../services/apiService';
import StatCard from './StatCard';

const STAT_CONFIG = [
  { key: 'totalPatients', label: 'Total Patients', accent: 'primary' },
  { key: 'totalRecords', label: 'Total Records' },
  { key: 'totalConsents', label: 'Total Consents' },
  { key: 'activeConsents', label: 'Active Consents' },
  { key: 'pendingConsents', label: 'Pending Consents' },
  { key: 'totalTransactions', label: 'Total Transactions' },
];

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getStats();
        setStats(response);
      } catch (err) {
        setStats(null);
        setError(err?.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-dashboard-container">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-dashboard-container">
        <div className="error">
          Error loading statistics: {error || 'No data available'}
        </div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard-container">
      <h2>Platform Statistics</h2>

      <div className="stats-grid">
        {STAT_CONFIG.map(({ key, label, accent }) => (
          <StatCard key={key} label={label} value={stats?.[key] ?? 0} accent={accent} />
        ))}
      </div>
    </div>
  );
};

export default StatsDashboard;
