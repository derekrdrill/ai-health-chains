import React, { useState, useEffect } from "react";
import "./PatientList.css";
import { apiService } from "../../services/apiService";

const PAGE_SIZE = 12;

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
      setError(err?.message || "Failed to load patients");
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

  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
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
            value={searchInput}
            onChange={handleSearchChange}
          />
          {showInlineLoader && (
            <div
              className="search-spinner"
              role="status"
              aria-label="Searching"
            />
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
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => onSelectPatient(patient.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectPatient(patient.id);
                }
              }}
            >
              <div className="patient-card-header">
                <div>
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-id">{patient.patientId}</div>
                </div>
                <div className="patient-id">
                  {formatAddress(patient.walletAddress)}
                </div>
              </div>
              <div className="patient-info">
                <div className="patient-info-item">
                  <strong>Email:</strong> {patient.email}
                </div>
                <div className="patient-info-item">
                  <strong>Phone:</strong> {patient.phone}
                </div>
                <div className="patient-info-item">
                  <strong>Gender:</strong> {patient.gender}
                </div>
                <div className="patient-info-item">
                  <strong>DOB:</strong>{" "}
                  {patient.dateOfBirth
                    ? new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(new Date(patient.dateOfBirth))
                    : "N/A"}
                </div>
              </div>
              <div className="patient-wallet">{patient.walletAddress}</div>
            </div>
          ))
        )}
        {showInlineLoader && (
          <div className="patient-list-overlay" aria-hidden="true">
            <div className="overlay-spinner" />
          </div>
        )}
      </div>

      {pagination && (
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          {Array.from({ length: pagination.totalPages || 0 }, (_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => goToPage(page)}
                disabled={loading}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={
              !pagination.totalPages ||
              currentPage === pagination.totalPages ||
              loading
            }
          >
            Next
          </button>
          <div className="pagination-info">
            {pagination.total > 0 ? (
              <>
                Showing {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </>
            ) : (
              "No patients to display"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
