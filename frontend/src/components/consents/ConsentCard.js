import React from 'react';

const ConsentCard = ({
  consent,
  formatDateTime,
  getStatusClass,
  onActivate,
  isUpdating,
}) => {
  const createdAt = formatDateTime(consent.createdAt);
  const statusClass = getStatusClass(consent.status);
  const blockchainHash = consent.blockchainTxHash || 'Not yet recorded';
  const shouldShowActivateButton = consent.status === 'pending';

  const handleActivate = () => {
    if (shouldShowActivateButton) {
      onActivate({
        consentId: consent.id,
        newStatus: 'active',
        currentHash: consent.blockchainTxHash,
      });
    }
  };

  return (
    <div className="consent-card">
      <div className="consent-header-info">
        <div>
          <div className="consent-purpose">{consent.purpose}</div>
          <div className="consent-detail-item">
            <strong>Patient:</strong> {consent.patientId}
          </div>
        </div>
        <span className={`consent-status ${statusClass}`}>{consent.status}</span>
      </div>

      <div className="consent-details">
        <div className="consent-detail-item">
          <strong>Wallet:</strong>
          <span className="consent-wallet">{consent.walletAddress}</span>
        </div>
        <div className="consent-detail-item">
          <strong>Created:</strong> {createdAt}
        </div>
        <div className="consent-detail-item">
          <strong>Tx Hash:</strong>
          <span className="consent-tx-hash">{blockchainHash}</span>
        </div>
      </div>

      {shouldShowActivateButton && (
        <div className="consent-actions">
          <button
            className="action-btn primary"
            onClick={handleActivate}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Activate Consent'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsentCard;
