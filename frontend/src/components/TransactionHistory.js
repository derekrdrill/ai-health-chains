import React, { useState, useEffect, useCallback } from "react";
import "./TransactionHistory.css";
import { apiService } from "../services/apiService";
import TransactionCard from "./TransactionHistory/_components/TransactionCard";

const DEFAULT_LIMIT = 20;

const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const walletFilter = account || null;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getTransactions(
        walletFilter,
        DEFAULT_LIMIT
      );
      setTransactions(response.transactions || []);
    } catch (err) {
      setTransactions([]);
      setError(err?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [walletFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">
          Error: {error}
          <button className="action-btn" onClick={fetchTransactions}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        {account && (
          <div className="wallet-filter">
            Filtering for: <span className="wallet-address">{account}</span>
          </div>
        )}
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="placeholder">
            <p>No transactions found.</p>
            {account && (
              <p>Try disconnecting the wallet filter to view all activity.</p>
            )}
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
