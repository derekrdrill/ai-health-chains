import React from 'react';
import PropTypes from 'prop-types';
import { formatAddress } from '../../helpers';

const formatBirthDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      dateStyle: 'medium',
    });
  } catch {
    return 'N/A';
  }
};

const PatientCard = ({ patient, onSelectPatient }) => {
  const handleSelect = () => {
    onSelectPatient(patient.id);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectPatient(patient.id);
    }
  };

  return (
    <div
      className="patient-card"
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="patient-card-header">
        <div>
          <div className="patient-name">{patient.name}</div>
          <div className="patient-id">{patient.patientId}</div>
        </div>
        <div className="patient-id">
          {formatAddress({
            address: patient.walletAddress,
            prefixLength: 8,
            suffixLength: 6,
          })}
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
          <strong>DOB:</strong> {formatBirthDate(patient.dateOfBirth)}
        </div>
      </div>
      <div className="patient-wallet">{patient.walletAddress}</div>
    </div>
  );
};

PatientCard.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    patientId: PropTypes.string,
    walletAddress: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    dateOfBirth: PropTypes.string,
  }).isRequired,
  onSelectPatient: PropTypes.func.isRequired,
};

export default PatientCard;
