import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { NetworkLink } from 'components';
import { getTransactionMethod } from 'helpers';
import { useNetworkPathname } from 'hooks';
import { UITransactionType } from 'types';

export interface TransactionMethodType {
  transaction: UITransactionType;
}

export const TransactionMethod = ({ transaction }: TransactionMethodType) => {
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);
  const networkPathname = useNetworkPathname();

  const methodLink = (method: string) => {
    const { ...rest } = Object.fromEntries(urlParams);
    if (method) {
      delete rest.page;
    }
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(method ? { function: method } : {})
    }).toString();
    return `${networkPathname}?${nextUrlParams}`;
  };

  const TxMethodText = ({ children }: { children: React.ReactNode }) => {
    const method = getTransactionMethod(transaction);

    return (
      <span>
        {networkPathname && method !== 'transaction' ? (
          <NetworkLink
            to={methodLink(getTransactionMethod(transaction))}
            data-testid='filterByTransactionMethod'
            className='text-decoration-none'
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
    <div className='d-inline-block'>
      <TxMethodText>
        <span className='badge badge-outline badge-outline-green'>
          <div className='transaction-function-badge text-truncate text-capitalize'>
            {getTransactionMethod(transaction)}
          </div>
        </span>
      </TxMethodText>
    </div>
  );

  return transaction.action?.description ? (
    <OverlayTrigger
      placement='top'
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
