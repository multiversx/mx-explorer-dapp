import { faExchangeAlt } from '@fortawesome/pro-solid-svg-icons/faExchangeAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function FailedTransaction() {
  return (
    <div>
      <div className="card">
        <div className="card-body card-details" data-testid="errorScreen">
          <div className="empty">
            <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
            <span className="h4 empty-heading">No transactions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
