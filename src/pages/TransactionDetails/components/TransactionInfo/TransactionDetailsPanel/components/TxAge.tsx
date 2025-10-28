import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TimeAgo } from 'components';
import { formatDate } from 'helpers';
import { faClock, faSpinner } from 'icons/regular';
import { TransactionApiStatusEnum, TransactionType } from 'types';

export const TxAge = ({ transaction }: { transaction: TransactionType }) => {
  const isTxPending =
    (transaction?.status &&
      transaction.status.toLowerCase() === TransactionApiStatusEnum.pending) ||
    transaction.pendingResults;

  if (!transaction.timestamp) {
    return <span>N/A</span>;
  }

  return (
    <div className='d-flex flex-wrap align-items-center'>
      {isTxPending ? (
        <FontAwesomeIcon icon={faSpinner} className='me-2 fa-spin slow-spin' />
      ) : (
        <FontAwesomeIcon icon={faClock} className='me-2' />
      )}
      <TimeAgo value={transaction.timestamp} />
      &nbsp;
      <span>({formatDate(transaction.timestamp, false, true)})</span>
    </div>
  );
};
