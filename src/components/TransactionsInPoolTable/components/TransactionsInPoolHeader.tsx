import {
  FromColumnFilters,
  TransactionInPoolTypeFilter,
  ToColumnFilters,
  ShardColumnFilters
} from 'components';
import { useIsSovereign } from 'hooks';
import { TransactionFiltersEnum, WithClassnameType } from 'types';

export interface TransactionsInPoolHeaderUIType extends WithClassnameType {
  inactiveFilters?: TransactionFiltersEnum[];
}

export const TransactionsInPoolHeader = ({
  inactiveFilters
}: TransactionsInPoolHeaderUIType) => {
  const isSovereign = useIsSovereign();
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
        <th scope='col'>Value</th>
      </tr>
    </thead>
  );
};
