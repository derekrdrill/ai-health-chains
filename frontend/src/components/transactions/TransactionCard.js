import React from "react";

const formatAddress = (address) => {
  if (!address) return "N/A";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

const formatAmount = (amount, currency) => {
  if (!amount) return "0";
  return `${Number(amount).toLocaleString()} ${currency || ""}`.trim();
};

const getTypeClass = (type) => {
  if (!type) return "unknown";
  return type.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
};

const getStatusClass = (status) => {
  if (!status) return "pending";
  return status.toLowerCase();
};

const TransactionCard = ({ transaction }) => {
  if (!transaction) return null;

  const typeClass = getTypeClass(transaction.type);
  const statusClass = getStatusClass(transaction.status);
  const formattedAmount = formatAmount(
    transaction.amount,
    transaction.currency
  );
  const formattedTimestamp = formatDateTime(transaction.timestamp);

  return (
    <div className="transaction-card">
      <div className="transaction-header-info">
        <span className={`transaction-type ${typeClass}`}>
          {transaction.type || "unknown"}
        </span>
        <span className={`transaction-status ${statusClass}`}>
          {transaction.status || "pending"}
        </span>
      </div>

      <div className="transaction-details">
        <div className="transaction-detail-item">
          <span className="transaction-detail-label">Amount</span>
          <span className="transaction-detail-value transaction-amount">
            {formattedAmount}
          </span>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-label">From</span>
          <span className="transaction-detail-value address">
            {formatAddress(transaction.from)}
          </span>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-label">To</span>
          <span className="transaction-detail-value address">
            {formatAddress(transaction.to)}
          </span>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-label">Tx Hash</span>
          <span className="transaction-detail-value hash">
            {transaction.blockchainTxHash || "Pending"}
          </span>
        </div>
      </div>

      <div className="transaction-detail-item">
        <span className="transaction-detail-label">Block</span>
        <span className="transaction-detail-value">
          {transaction.blockNumber || "N/A"}
        </span>
      </div>

      <div className="transaction-timestamp">{formattedTimestamp}</div>
    </div>
  );
};

export default TransactionCard;
