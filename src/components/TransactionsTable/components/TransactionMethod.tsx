import { useRef, useState, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { Overlay } from 'components';
import { getTransactionMethod, isEllipsisActive } from 'helpers';
import { UITransactionType } from 'types';

export interface TransactionMethodType {
  transaction: UITransactionType;
}

export const TransactionMethod = ({ transaction }: TransactionMethodType) => {
  const badgeTextRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const { function: filteredFunction } = Object.fromEntries(searchParams);

  useLayoutEffect(() => {
    if (badgeTextRef?.current) {
      setIsTextTruncated(isEllipsisActive(badgeTextRef?.current));
    }
  }, []);

  const transactionMethodText = getTransactionMethod(transaction);
  if (!transactionMethodText) {
    return null;
  }

  const showDescription = Boolean(
    transaction.action?.description &&
      transaction.action.description !== 'Transfer'
  );
  const showTooltip = showDescription || isTextTruncated;

  const updateMethod = (method: string) => {
    const { page, size, ...rest } = Object.fromEntries(searchParams);
    if (method) {
      delete rest.page;
    }
    const nextUrlParams = {
      ...rest,
      ...(method ? { function: method } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const TransactionMethodText = ({
    children
  }: {
    children: React.ReactNode;
  }) => {
    return (
      <span>
        {!['transaction', 'transfer', filteredFunction].includes(
          transactionMethodText
        ) ? (
          <div
            onClick={() => {
              updateMethod(transactionMethodText);
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

  const TransactionMethodBadge = () => (
    <div className='d-inline-block'>
      <TransactionMethodText>
        <span className='badge badge-outline badge-outline-green'>
          <div
            className='transaction-function-badge text-truncate text-capitalize'
            ref={badgeTextRef}
          >
            {transactionMethodText}
          </div>
        </span>
      </TransactionMethodText>
    </div>
  );

  return showTooltip ? (
    <Overlay
      title={
        <>
          {isTextTruncated && (
            <p className={classNames({ 'mb-0': !showDescription })}>
              {transactionMethodText}
            </p>
          )}
          {showDescription && (
            <p className='mb-0'>{transaction.action?.description}</p>
          )}
        </>
      }
      className='method-tooltip'
    >
      <TransactionMethodBadge />
    </Overlay>
  ) : (
    <TransactionMethodBadge />
  );
};
