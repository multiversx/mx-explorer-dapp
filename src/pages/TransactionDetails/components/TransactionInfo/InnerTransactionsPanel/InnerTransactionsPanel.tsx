import { DetailItem } from 'components';
import { InnerTransactionsList } from 'pages/TransactionDetails/components';
import { TransactionType } from 'types';

export const InnerTransactionsPanel = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  return (
    <>
      {transaction.innerTransactions &&
        transaction.innerTransactions.length > 0 && (
          <div className='row'>
            <DetailItem
              title={<div className='item-title'>Inner Transactions</div>}
            >
              <InnerTransactionsList
                innerTransactions={transaction.innerTransactions}
                txHash={transaction.txHash}
              />
            </DetailItem>
          </div>
        )}
    </>
  );
};
