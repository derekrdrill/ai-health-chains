import React, { useState, useEffect, useCallback } from "react";
import "./ConsentManagement.css";
import { apiService } from "../../services/apiService";
import { useWeb3 } from "../../hooks/useWeb3";
import ConsentCard from "./ConsentCard";

const DEFAULT_FORM = { patientId: "", purpose: "" };

const ConsentManagement = ({ account }) => {
  const { signMessage } = useWeb3();
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingConsentId, setUpdatingConsentId] = useState(null);

  const hasNoConsents = consents.length === 0;
  const shouldShowCreateForm = showCreateForm && account;
  const statusFilter = filterStatus === "all" ? null : filterStatus;

  const fetchConsents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getConsents(null, statusFilter);
      setConsents(response.consents || []);
    } catch (err) {
      setConsents([]);
      setError(err?.message || "Failed to load consents");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchConsents();
  }, [fetchConsents]);

  const formatDateTime = (isoDate) => {
    if (!isoDate) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(isoDate));
  };

  const getStatusClass = (status) =>
    status === "active" ? "active" : "pending";

  const generateTxHash = () => {
    const randomSegment = Math.random().toString(16).slice(2, 10);
    return `0x${Date.now().toString(16)}${randomSegment}`;
  };

  const handleCreateConsent = async (e) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    try {
      const { patientId, purpose } = formData;
      const message = `I consent to: ${purpose} for patient: ${patientId}`;
      const signature = await signMessage(message);

      await apiService.createConsent({
        patientId,
        purpose,
        walletAddress: account,
        signature,
      });

      setFormData(DEFAULT_FORM);
      setShowCreateForm(false);
      fetchConsents();
    } catch (err) {
      alert(`Failed to create consent: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async ({ consentId, newStatus, currentHash }) => {
    setUpdatingConsentId(consentId);
    try {
      const updates = { status: newStatus };
      if (newStatus === "active" && !currentHash) {
        updates.blockchainTxHash = generateTxHash();
      }

      await apiService.updateConsent(consentId, updates);
      fetchConsents();
    } catch (err) {
      alert(`Failed to update consent: ${err.message}`);
    } finally {
      setUpdatingConsentId(null);
    }
  };

  if (loading) {
    return (
      <div className="consent-management-container">
        <div className="loading">Loading consents...</div>
      </div>
    );
  }

  return (
    <div className="consent-management-container">
      <div className="consent-header">
        <h2>Consent Management</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!account}
        >
          {showCreateForm ? "Cancel" : "Create New Consent"}
        </button>
      </div>

      {!account && (
        <div className="warning">
          Please connect your MetaMask wallet to manage consents
        </div>
      )}

      {error && (
        <div className="warning">
          {error}
          <button className="action-btn" onClick={fetchConsents}>
            Retry
          </button>
        </div>
      )}

      {shouldShowCreateForm && (
        <div className="create-consent-form">
          <h3>Create New Consent</h3>
          <form onSubmit={handleCreateConsent}>
            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                required
                placeholder="e.g., patient-001"
              />
            </div>
            <div className="form-group">
              <label>Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                required
              >
                <option value="">Select purpose...</option>
                <option value="Research Study Participation">
                  Research Study Participation
                </option>
                <option value="Data Sharing with Research Institution">
                  Data Sharing with Research Institution
                </option>
                <option value="Third-Party Analytics Access">
                  Third-Party Analytics Access
                </option>
                <option value="Insurance Provider Access">
                  Insurance Provider Access
                </option>
              </select>
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing..." : "Sign & Create Consent"}
            </button>
          </form>
        </div>
      )}

      <div className="consent-filters">
        <button
          className={filterStatus === "all" ? "active" : ""}
          onClick={() => setFilterStatus("all")}
        >
          All
        </button>
        <button
          className={filterStatus === "active" ? "active" : ""}
          onClick={() => setFilterStatus("active")}
        >
          Active
        </button>
        <button
          className={filterStatus === "pending" ? "active" : ""}
          onClick={() => setFilterStatus("pending")}
        >
          Pending
        </button>
      </div>

      <div className="consents-list">
        {hasNoConsents ? (
          <div className="placeholder">
            <p>No consents found for this filter.</p>
          </div>
        ) : (
          consents.map((consent) => (
            <ConsentCard
              key={consent.id}
              consent={consent}
              formatDateTime={formatDateTime}
              getStatusClass={getStatusClass}
              onActivate={handleUpdateStatus}
              isUpdating={updatingConsentId === consent.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConsentManagement;
