import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAdapter } from 'hooks';
import { faAngleDown } from 'icons/regular';
import { TransactionType, TransactionApiStatusEnum } from 'types';

export const NonceMessage = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const ref = useRef(null);
  const { getAccount } = useAdapter();
  const {
    sender: senderAddress,
    nonce: transactionNonce,
    timestamp,
    status
  } = transaction;
  const [isDataReady, setIsDataReady] = useState<boolean>(false);
  const [hasUnsyncedNonce, setHasUnsyncedNonce] = useState<boolean>(false);

  const isTxPending =
    (status && status.toLowerCase() === TransactionApiStatusEnum.pending) ||
    transaction.pendingResults;

  const getSenderNonce = () => {
    getAccount({ address: senderAddress }).then((accountDetailsData) => {
      if (ref.current !== null && accountDetailsData.success) {
        const data = accountDetailsData.data;
        const { nonce: accountNonce } = data;
        setHasUnsyncedNonce(transactionNonce > accountNonce);
        setIsDataReady(true);
      } else {
        setIsDataReady(false);
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (senderAddress && isTxPending) {
        getSenderNonce();
      }
    }, 1000 * 60); // 1 minute

    return () => clearTimeout(timer);
  }, [senderAddress, timestamp, isTxPending]);

  return (
    <div ref={ref}>
      {isDataReady && hasUnsyncedNonce && (
        <div className='d-flex ms-1 text-break-all'>
          <FontAwesomeIcon
            icon={faAngleDown}
            className='text-neutral-400'
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          &nbsp;
          <small className='text-warning ms-1'>
            {' '}
            Probable higher nonce in transaction
          </small>
        </div>
      )}
    </div>
  );
};
