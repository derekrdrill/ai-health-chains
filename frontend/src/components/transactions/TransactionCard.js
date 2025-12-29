import React from 'react';
import PropTypes from 'prop-types';
import { formatAddress, formatDateTime, getStatusClass } from '../../helpers';

const formatAmount = (amount, currency) => {
  if (!amount) return '0';
  return `${Number(amount).toLocaleString()} ${currency || ''}`.trim();
};

const getTypeClass = (type) => {
  if (!type) return 'unknown';
  return type.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
};

const TransactionCard = ({ transaction }) => {
  if (!transaction) return null;

  const typeClass = getTypeClass(transaction.type);
  const statusClass = getStatusClass({ status: transaction.status });
  const formattedAmount = formatAmount(transaction.amount, transaction.currency);
  const formattedTimestamp = formatDateTime({ value: transaction.timestamp });

  return (
    <div className="transaction-card">
      <div className="transaction-header-info">
        <span className={`transaction-type ${typeClass}`}>
          {transaction.type || 'unknown'}
        </span>
        <span className={`transaction-status ${statusClass}`}>
          {transaction.status || 'pending'}
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
            {formatAddress({
              address: transaction.from,
              prefixLength: 8,
              suffixLength: 6,
            })}
          </span>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-label">To</span>
          <span className="transaction-detail-value address">
            {formatAddress({ address: transaction.to, prefixLength: 8, suffixLength: 6 })}
          </span>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-label">Tx Hash</span>
          <span className="transaction-detail-value hash">
            {transaction.blockchainTxHash || 'Pending'}
          </span>
        </div>
      </div>

      <div className="transaction-detail-item">
        <span className="transaction-detail-label">Block</span>
        <span className="transaction-detail-value">
          {transaction.blockNumber || 'N/A'}
        </span>
      </div>

      <div className="transaction-timestamp">{formattedTimestamp}</div>
    </div>
  );
};

TransactionCard.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
    timestamp: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    blockchainTxHash: PropTypes.string,
    blockNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default TransactionCard;
