import { TransactionTableType } from 'types';

import {
  AgeColumnFilters,
  FromColumnFilters,
  ShardColumnFilters,
  StatusColumnFilters,
  MethodColumnFilters,
  ToColumnFilters,
  ValueColumnFilters
} from '../TransactionsFilters';

export const Header = ({
  showDirectionCol = false,
  inactiveFilters
}: TransactionTableType) => {
  return (
    <thead>
      <tr>
        <th scope='col'>
          Txn Hash <StatusColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          Age <AgeColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          Shard <ShardColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          From <FromColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        {showDirectionCol && <th scope='col' />}
        <th scope='col'>
          To <ToColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          Method <MethodColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          Value <ValueColumnFilters inactiveFilters={inactiveFilters} />
        </th>
      </tr>
    </thead>
  );
};
