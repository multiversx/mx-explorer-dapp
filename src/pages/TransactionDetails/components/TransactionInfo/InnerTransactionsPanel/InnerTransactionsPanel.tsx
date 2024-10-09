import { DetailItem } from 'components';
import { InnerTransactionsList } from 'pages/TransactionDetails/components';
import { TransactionType } from 'types';

export const InnerTransactionsPanel = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const innerTransactions = transaction.innerTransactions;
  if (!innerTransactions || innerTransactions.length === 0) {
    return null;
  }

  return (
    <div className='row'>
      <DetailItem title={<div className='item-title'>Inner Transactions</div>}>
        <InnerTransactionsList
          innerTransactions={innerTransactions}
          txHash={transaction.txHash}
        />
      </DetailItem>
    </div>
  );
};
