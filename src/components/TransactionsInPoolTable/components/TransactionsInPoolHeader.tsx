import {
  FromColumnFilters,
  TransactionInPoolTypeFilter,
  ToColumnFilters
} from 'components';
import { TransactionFiltersEnum, WithClassnameType } from 'types';

export interface TransactionsInPoolHeaderUIType extends WithClassnameType {
  inactiveFilters?: TransactionFiltersEnum[];
}

export const TransactionsInPoolHeader = ({
  inactiveFilters
}: TransactionsInPoolHeaderUIType) => {
  return (
    <thead>
      <tr>
        <th scope='col'>Txn Hash</th>
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
