import { useRef, useState, useLayoutEffect } from 'react';
import classNames from 'classnames';

import { Overlay } from 'components';
import { isEllipsisActive } from 'helpers';
import { UITransactionInPoolType } from 'types';

export interface TransactionMethodType {
  transaction: UITransactionInPoolType;
  hasHighlight?: boolean;
}

export const TransactionInPoolMethodBadge = ({
  transaction
}: TransactionMethodType) => {
  const badgeTextRef = useRef(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  useLayoutEffect(() => {
    if (badgeTextRef?.current) {
      setIsTextTruncated(isEllipsisActive(badgeTextRef?.current));
    }
  }, []);

  const showTooltip = isTextTruncated;
  const transactionInPoolMethodText = transaction?.function || 'Transfer';

  const TransactionMethodBadge = () => {
    return (
      <div className='d-inline-block'>
        <span className={classNames('badge badge-outline badge-outline-green')}>
          <div
            className='transaction-function-badge text-truncate text-capitalize'
            ref={badgeTextRef}
          >
            {transactionInPoolMethodText}
          </div>
        </span>
      </div>
    );
  };

  return showTooltip ? (
    <Overlay
      title={
        <>
          {isTextTruncated && (
            <p className='mb-0'>{transactionInPoolMethodText}</p>
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
