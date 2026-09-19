import { CopyButton, AccountLink, ShardLink } from 'components';
import { isContract } from 'helpers';
import { TransactionErrorDisplay } from 'pages/TransactionDetails/components';
import { TransactionType } from 'types';

interface TxToUIType {
  transaction: TransactionType;
  showError?: boolean;
  showShard?: boolean;
  showContractLabel?: boolean;
}

export const TxTo = ({
  transaction,
  showError = true,
  showShard = true,
  showContractLabel = true
}: TxToUIType) => {
  return (
    <div className='d-flex flex-column'>
      <div className='d-flex align-items-center'>
        {showContractLabel && isContract(transaction.receiver) && (
          <span className='me-2 text-neutral-400'>Contract</span>
        )}
        <AccountLink
          address={transaction.receiver}
          assets={transaction.receiverAssets}
          hasHighlight
        />
        <CopyButton className='me-2' text={transaction.receiver} />
        {Boolean(!isNaN(transaction.receiverShard) && showShard) && (
          <ShardLink
            shard={transaction.receiverShard}
            className='flex-shrink-0'
            transactionReceiverShard
            hasParanthesis
          />
        )}
      </div>
      {showError && (
        <div className='d-flex flex-column gap-1'>
          <TransactionErrorDisplay transaction={transaction} />
        </div>
      )}
    </div>
  );
};
