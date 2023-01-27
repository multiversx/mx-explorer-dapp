import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { getTransactionMethod } from 'helpers';
import { UITransactionType } from 'types';

export interface TransactionMethodType {
  transaction: UITransactionType;
}

export const TransactionMethod = ({ transaction }: TransactionMethodType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { function: filteredFunction } = Object.fromEntries(searchParams);

  const updateMethod = (method: string) => {
    const { ...rest } = Object.fromEntries(searchParams);
    if (method) {
      delete rest.page;
    }
    const nextUrlParams = {
      ...rest,
      ...(method ? { function: method } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const TxMethodText = ({ children }: { children: React.ReactNode }) => {
    const method = getTransactionMethod(transaction);

    return (
      <span>
        {method !== 'transaction' && method !== filteredFunction ? (
          <div
            onClick={() => {
              updateMethod(getTransactionMethod(transaction));
            }}
            data-testid='filterByTransactionMethod'
            className='text-decoration-none cursor-pointer'
          >
            {children}
          </div>
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
