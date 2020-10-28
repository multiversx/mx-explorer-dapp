import * as React from 'react';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { PageState } from 'sharedComponents';

export default function NoTransactions() {
  return (
    <div className="card card-small">
      <div className="card-body">
        <PageState
          icon={faExchangeAlt}
          title="No transactions"
          className="py-spacer d-flex h-100 align-items-center justify-content-center"
        />
      </div>
    </div>
  );
}
