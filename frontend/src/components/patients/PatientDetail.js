import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PatientDetail.css';
import { apiService } from '../../services/apiService';

const PatientDetail = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasErrorLoadingPatient = error || !patient;
  const hasNoRecords = records.length === 0;

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [patientData, recordsResponse] = await Promise.all([
          apiService.getPatient(patientId),
          apiService.getPatientRecords(patientId),
        ]);

        setPatient(patientData);
        setRecords(recordsResponse.records || []);
      } catch (err) {
        setPatient(null);
        setRecords([]);
        setError(err?.message || 'Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        dateStyle: 'medium',
        timeZone: 'UTC',
      });
    } catch {
      return 'N/A';
    }
  };

  const getRecordTypeClass = (type) => {
    if (!type) return '';
    const normalized = type.toLowerCase();
    if (normalized.includes('lab')) return 'lab';
    if (normalized.includes('treat')) return 'treatment';
    return 'diagnostic';
  };

  const getRecordDescription = (description) => {
    if (!description) return '';
    return description.length > 320 ? `${description.slice(0, 320)}…` : description;
  };

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="loading">Loading patient details...</div>
      </div>
    );
  }

  if (hasErrorLoadingPatient) {
    return (
      <div className="patient-detail-container">
        <div className="error">Error loading patient: {error || 'Patient not found'}</div>
        <button onClick={onBack} className="back-btn">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="patient-detail-container">
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-btn">
          ← Back to List
        </button>
      </div>

      <div className="patient-detail-content">
        <div className="patient-info-section">
          <h2>Patient Information</h2>
          <div className="patient-info-grid">
            <div className="info-item">
              <span className="info-label">Name</span>
              <span className="info-value">{patient.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Patient ID</span>
              <span className="info-value">{patient.patientId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{patient.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{patient.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">{patient.gender}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date of Birth</span>
              <span className="info-value">{formatDate(patient.dateOfBirth)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Address</span>
              <span className="info-value">{patient.address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Wallet</span>
              <span className="info-value wallet">{patient.walletAddress || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="patient-records-section">
          <h2>Medical Records ({records.length})</h2>
          {hasNoRecords ? (
            <div className="placeholder">
              <p>No medical records found for this patient.</p>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <div>
                      <div className="record-title">{record.title}</div>
                      <div className="record-date">{formatDate(record.date)}</div>
                    </div>
                    <span className={`record-type ${getRecordTypeClass(record.type)}`}>
                      {record.type}
                    </span>
                  </div>
                  <p className="record-description">
                    {getRecordDescription(record.description)}
                  </p>
                  <div className="record-meta">
                    <div className="record-meta-item">
                      <strong>Doctor:</strong> {record.doctor}
                    </div>
                    <div className="record-meta-item">
                      <strong>Hospital:</strong> {record.hospital}
                    </div>
                    <div className="record-meta-item">
                      <strong>Blockchain Hash:</strong> {record.blockchainHash}
                    </div>
                    <div className="record-status-wrapper">
                      <span className={`record-status ${record.status}`}>
                        Status: {record.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;

PatientDetail.propTypes = {
  patientId: PropTypes.string,
  onBack: PropTypes.func.isRequired,
};
