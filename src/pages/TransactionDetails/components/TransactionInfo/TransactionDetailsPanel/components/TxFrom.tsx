import { ShardSpan, CopyButton, AccountLink, ShardLink } from 'components';
import { addressIsBech32 } from 'helpers';
import { TransactionType } from 'types';

interface TxFromUIType {
  transaction: TransactionType;
  showShard?: boolean;
}

export const TxFrom = ({ transaction, showShard = true }: TxFromUIType) => {
  return (
    <div className='d-flex align-items-center'>
      {addressIsBech32(transaction.sender) ? (
        <>
          <AccountLink
            address={transaction.sender}
            assets={transaction.senderAssets}
            hasHighlight
          />
          <CopyButton className='me-2' text={transaction.sender} />
          {showShard && (
            <ShardLink
              shard={transaction.senderShard}
              className='flex-shrink-0'
              transactionSenderShard
              hasParanthesis
            />
          )}
        </>
      ) : (
        <ShardSpan shard={transaction.sender} />
      )}
    </div>
  );
};
