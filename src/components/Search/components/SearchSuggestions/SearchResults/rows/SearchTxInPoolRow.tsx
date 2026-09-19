import { FormatAmount, NetworkLink, Trim } from 'components';
import { TransactionInPoolTypeBadge } from 'components/TransactionsInPoolTable/components';
import { TransactionInPoolMethodBadge } from 'components/TransactionsInPoolTable/components/TransactionInPoolMethodBadge';
import { urlBuilder } from 'helpers';
import { UITransactionInPoolType } from 'types';

export const SearchTxInPoolRow = ({
  transactionInPool
}: {
  transactionInPool?: UITransactionInPoolType;
}) => {
  if (!transactionInPool) {
    return;
  }

  return (
    <>
      <div className='search-category'>
        Txn Hash<div className='ms-auto'>Value</div>
      </div>
      <NetworkLink
        to={urlBuilder.transactionInPoolDetails(transactionInPool.txHash)}
        className='search-suggestion selectable'
      >
        <div className='d-flex align-items-center gap-2 search-text'>
          <div className='d-flex align-items-center hash trim text-truncate'>
            <Trim text={transactionInPool.txHash} />
          </div>
          <div className='d-flex align-items-center gap-1'>
            <TransactionInPoolTypeBadge type={transactionInPool.type} />
            <TransactionInPoolMethodBadge transaction={transactionInPool} />
          </div>
        </div>
        <div className='ms-auto'>
          <FormatAmount value={transactionInPool.value} />
        </div>
      </NetworkLink>
    </>
  );
};
