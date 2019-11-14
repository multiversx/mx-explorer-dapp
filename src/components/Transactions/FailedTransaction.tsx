import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

export default function FailedTransaction() {
  return (
    <>
      <h4>Transactions</h4>
      <div className="card">
        <div className="card-body card-details" data-testid="errorScreen">
          <div className="empty">
            <FontAwesomeIcon icon={faWallet} className="empty-icon" />
            <span className="h4 empty-heading">Unable to load transactions</span>
          </div>
        </div>
      </div>
    </>
  );
}
