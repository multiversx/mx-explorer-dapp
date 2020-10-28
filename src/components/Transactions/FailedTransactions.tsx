import * as React from 'react';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FailedTransactions() {
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
