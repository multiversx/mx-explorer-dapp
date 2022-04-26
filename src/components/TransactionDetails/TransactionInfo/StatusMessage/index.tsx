import * as React from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { adapter } from 'sharedComponents';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import { TransactionType } from 'helpers/types';

const StatusMessage = ({ transaction }: { transaction: TransactionType }) => {
  const ref = React.useRef(null);
  const { getAccount } = adapter();
  const { sender: senderAddress, nonce: transactionNonce, timestamp, status } = transaction;
  const [isDataReady, setIsDataReady] = React.useState<boolean>(false);
  const [hasUnsyncedNonce, setHasUnsyncedNonce] = React.useState<boolean>(false);

  const isTxPending =
    status.toLowerCase() === txStatus.pending.toLowerCase() || transaction.pendingResults;

  const getSenderNonce = () => {
    getAccount(senderAddress).then((accountDetailsData) => {
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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (senderAddress && isTxPending) {
        getSenderNonce();
      }
    }, 1000 * 60); // 1 minute

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderAddress, timestamp, isTxPending]);

  return (
    <div ref={ref}>
      {isDataReady && hasUnsyncedNonce && (
        <div className="d-flex ml-1 text-break-all">
          <FontAwesomeIcon
            icon={faAngleDown}
            className="text-secondary"
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          &nbsp;
          <small className="text-warning ml-1"> Probable higher nonce in transaction</small>
        </div>
      )}
    </div>
  );
};

export default StatusMessage;
