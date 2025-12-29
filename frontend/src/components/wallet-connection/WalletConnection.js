import React from 'react';
import PropTypes from 'prop-types';
import { formatAddress } from '../../helpers';
import './WalletConnection.css';

const WalletConnection = ({ account, isConnected, onConnect, onDisconnect }) => {
  return (
    <div className="wallet-connection">
      {isConnected ? (
        <div className="wallet-info">
          <div className="wallet-address">
            <span className="wallet-icon">🔗</span>
            <span className="address-text">
              {formatAddress({ address: account, fallback: '' })}
            </span>
          </div>
          <button className="disconnect-btn" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <button className="connect-btn" onClick={onConnect}>
          Connect MetaMask
        </button>
      )}
    </div>
  );
};

WalletConnection.propTypes = {
  account: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  onConnect: PropTypes.func.isRequired,
  onDisconnect: PropTypes.func.isRequired,
};

export default WalletConnection;
