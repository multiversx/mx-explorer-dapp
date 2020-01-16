import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function FailedTransaction() {
  return (
    <div className="card">
      <div className="card-body card-details" data-testid="errorScreen">
        <div className="empty">
          <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
          <span className="h4 empty-heading">Unable to load transactions</span>
        </div>
      </div>
    </div>
  );
}
