import { TransactionInnerType } from 'types';

import { InnerTransaction } from './InnerTransaction';

interface InnerTransactionsListUIType {
  innerTransactions: TransactionInnerType[];
  txHash: string;
}

export const InnerTransactionsList = ({
  innerTransactions,
  ...props
}: InnerTransactionsListUIType) => (
  <div className='inner-tx-list item-list d-flex flex-column mt-1'>
    {innerTransactions.map((innerTransaction, i) => (
      <InnerTransaction
        key={i}
        index={i}
        innerTransaction={innerTransaction}
        {...props}
      />
    ))}
  </div>
);
