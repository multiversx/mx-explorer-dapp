import { CopyButton, AccountLink } from 'components';
import { isContract, getDisplayReceiver } from 'helpers';
import { TransactionType } from 'types';

export const TxReceiver = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const { receiver, receiverAssets } = getDisplayReceiver(transaction);

  if (receiver === transaction.receiver) {
    return null;
  }

  return (
    <div className='d-flex align-items-center'>
      {isContract(receiver) && (
        <span className='me-2 text-neutral-400'>Contract</span>
      )}
      <AccountLink address={receiver} assets={receiverAssets} hasHighlight />
      <CopyButton className='me-2' text={receiver} />
    </div>
  );
};
