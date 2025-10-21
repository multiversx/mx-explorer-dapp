import { useSelector } from 'react-redux';

import {
  FromColumnFilters,
  TransactionInPoolTypeFilter,
  ToColumnFilters,
  ShardColumnFilters,
  PauseRefreshButton
} from 'components';
import { useIsSovereign } from 'hooks';
import { transactionsInPoolSelector } from 'redux/selectors';
import { pauseRefresh, resumeRefresh } from 'redux/slices/transactionsInPool';
import { TransactionFiltersEnum, WithClassnameType } from 'types';

export interface TransactionsInPoolHeaderUIType extends WithClassnameType {
  inactiveFilters?: TransactionFiltersEnum[];
}

export const TransactionsInPoolHeader = ({
  inactiveFilters
}: TransactionsInPoolHeaderUIType) => {
  const isSovereign = useIsSovereign();
  const { isRefreshPaused } = useSelector(transactionsInPoolSelector);

  return (
    <thead>
      <tr>
        <th scope='col'>Txn Hash</th>
        <th scope='col'>
          {isSovereign ? (
            <>Chain</>
          ) : (
            <>
              Shard <ShardColumnFilters inactiveFilters={inactiveFilters} />
            </>
          )}
        </th>
        <th scope='col'>
          From <FromColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          To <ToColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          <TransactionInPoolTypeFilter text='Type' />
        </th>
        <th scope='col'>Method</th>

        <th
          scope='col'
          className='d-flex align-item-center justify-content-between'
        >
          Value{' '}
          <PauseRefreshButton
            pauseRefresh={pauseRefresh}
            resumeRefresh={resumeRefresh}
            isRefreshPaused={isRefreshPaused}
          />
        </th>
      </tr>
    </thead>
  );
};
