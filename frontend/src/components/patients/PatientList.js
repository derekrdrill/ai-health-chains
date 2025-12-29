import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PatientList.css';
import PatientPaginationControls from './PatientPaginationControls';
import PatientCard from './PatientCard';
import { apiService } from '../../services/apiService';

const PAGE_SIZE = 12;

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const { patients: patientResults = [], pagination: paginationMeta } =
        await apiService.getPatients(currentPage, PAGE_SIZE, searchTerm);

      setPatients(patientResults);
      setPagination(paginationMeta);
    } catch (err) {
      setPatients([]);
      setPagination(null);
      setError(err?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setSearchTerm(searchInput.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setLoading(true);
  };

  const goToPage = (page) => {
    if (
      page === currentPage ||
      page < 1 ||
      (pagination && page > pagination.totalPages)
    ) {
      return;
    }
    setCurrentPage(page);
  };

  const isInitialLoad = loading && patients.length === 0 && !error;
  const showInlineLoader = loading && patients.length > 0;

  if (isInitialLoad) {
    return (
      <div className="patient-list-container">
        <div className="loading">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Patients</h2>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search patients..."
            className="search-input"
            id="patient-search-input"
            value={searchInput}
            onChange={handleSearchChange}
          />
          {showInlineLoader && (
            <div className="search-spinner" role="status" aria-label="Searching" />
          )}
        </div>
      </div>

      <div className="patient-list">
        {patients.length === 0 ? (
          <div className="placeholder">
            <p>No patients found.</p>
          </div>
        ) : (
          patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onSelectPatient={onSelectPatient}
            />
          ))
        )}
        {showInlineLoader && (
          <div className="patient-list-overlay" aria-hidden="true">
            <div className="overlay-spinner" />
          </div>
        )}
      </div>

      {pagination && (
        <PatientPaginationControls
          pagination={pagination}
          currentPage={currentPage}
          loading={loading}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default PatientList;

PatientList.propTypes = {
  onSelectPatient: PropTypes.func.isRequired,
};
