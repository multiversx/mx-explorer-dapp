import { useRef, useState, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Overlay } from 'components';
import { getTransactionMethod, isEllipsisActive, isTouchDevice } from 'helpers';
import { interfaceSelector } from 'redux/selectors';
import { setHighlightedText } from 'redux/slices/interface';
import { UITransactionType } from 'types';

export interface TransactionMethodType {
  transaction: UITransactionType;
  hasHighlight?: boolean;
}

export const TransactionMethod = ({
  transaction,
  hasHighlight
}: TransactionMethodType) => {
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

  const TransactionMethodBadge = () => {
    const dispatch = useDispatch();
    const { highlightedText } = useSelector(interfaceSelector);

    const isTouch = isTouchDevice();
    const isHighlightBadge =
      !isTouch && hasHighlight && highlightedText === transactionMethodText;

    return (
      <div className='d-inline-block'>
        <TransactionMethodText>
          <span
            className={classNames('badge badge-outline badge-outline-green', {
              'badge-outline-highlight': isHighlightBadge
            })}
            {...(hasHighlight && !isTouch
              ? {
                  onMouseEnter: () => {
                    dispatch(setHighlightedText(transactionMethodText));
                  },
                  onMouseLeave: () => dispatch(setHighlightedText(''))
                }
              : {})}
          >
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
  };

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
      persistent
    >
      <TransactionMethodBadge />
    </Overlay>
  ) : (
    <TransactionMethodBadge />
  );
};
