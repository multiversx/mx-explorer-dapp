import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { UITransactionType } from 'helpers/types';
import { getTransactionMethod } from 'helpers';
import { NetworkLink } from 'sharedComponents';

export interface TransactionMethodType {
  transaction: UITransactionType;
  baseRoute?: string;
  allowFilters?: boolean;
}

const TransactionMethod = ({ transaction, baseRoute, allowFilters }: TransactionMethodType) => {
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);

  const methodLink = (method: string) => {
    const { ...rest } = Object.fromEntries(urlParams);
    if (method) {
      delete rest.page;
    }
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(method ? { function: method } : {}),
    }).toString();
    return `${baseRoute}?${nextUrlParams}`;
  };

  const TxMethodText = ({ children }: { children: React.ReactNode }) => {
    const method = getTransactionMethod(transaction);

    return (
      <span>
        {allowFilters && baseRoute && method !== 'transaction' ? (
          <NetworkLink
            to={methodLink(getTransactionMethod(transaction))}
            data-testid="filterByTransactionMethod"
          >
            {children}
          </NetworkLink>
        ) : (
          <span>{children}</span>
        )}
      </span>
    );
  };

  const TxMethodBadge = (
    <div className="d-inline-block">
      <TxMethodText>
        <span className="badge badge-secondary badge-pill font-weight-light">
          <div className="transaction-function-badge text-truncate text-capitalize">
            {getTransactionMethod(transaction)}
          </div>
        </span>
      </TxMethodText>
    </div>
  );

  return transaction.action?.description ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 0, hide: 400 }}
      overlay={(props: any) => (
        <Tooltip {...props} show={props.show.toString()}>
          {transaction.action?.description}
        </Tooltip>
      )}
    >
      {TxMethodBadge}
    </OverlayTrigger>
  ) : (
    TxMethodBadge
  );
};

export default TransactionMethod;
