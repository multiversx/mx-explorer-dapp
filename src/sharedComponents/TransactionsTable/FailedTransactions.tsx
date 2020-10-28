import * as React from 'react';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { PageState } from 'sharedComponents';

export default function FailedTransactions() {
  return (
    <div className="card">
      <div className="card-body">
        <PageState
          icon={faExchangeAlt}
          title="Unable to load transactions"
          className="py-spacer d-flex h-100 align-items-center justify-content-center"
          data-testid="errorScreen"
        />
      </div>
    </div>
  );
}
