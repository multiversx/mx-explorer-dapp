import { NetworkLink, TransactionIcons, Trim } from 'components';
import {
  TransactionMethod,
  TransactionValue
} from 'components/TransactionsTable/components';
import { urlBuilder } from 'helpers';
import { UITransactionType } from 'types';

export const SearchTransactionRow = ({
  transaction
}: {
  transaction?: UITransactionType;
}) => {
  if (!transaction) {
    return;
  }

  return (
    <>
      <div className='search-category'>
        Txn Hash<div className='ms-auto'>Value</div>
      </div>
      <NetworkLink
        to={urlBuilder.transactionDetails(transaction.txHash)}
        className='search-suggestion selectable'
      >
        <div className='d-flex align-items-center gap-2 search-text'>
          <div className='d-flex align-items-center hash trim text-truncate'>
            <TransactionIcons transaction={transaction} />
            <Trim text={transaction.txHash} />
          </div>
          <TransactionMethod transaction={transaction} />
        </div>

        <div className='ms-auto'>
          <TransactionValue transaction={transaction} />
        </div>
      </NetworkLink>
    </>
  );
};
