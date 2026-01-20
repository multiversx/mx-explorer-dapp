import { useSelector } from 'react-redux';

import { searchSelector } from 'redux/selectors';

import { SearchScResultRow } from './rows/SearchScResultRow';
import { SearchTransactionRow } from './rows/SearchTransactionRow';
import { SearchTxInPoolRow } from './rows/SearchTxInPoolRow';

export const SearchTransactions = () => {
  const { search } = useSelector(searchSelector);
  const { transaction, transactionInPool, scResult } = search;

  if (!(transaction || transactionInPool || scResult)) {
    return null;
  }

  return (
    <div className='search-group search-transactions'>
      <SearchTransactionRow transaction={transaction} />
      <SearchTxInPoolRow transactionInPool={transactionInPool} />
      <SearchScResultRow scResult={scResult} />
    </div>
  );
};
