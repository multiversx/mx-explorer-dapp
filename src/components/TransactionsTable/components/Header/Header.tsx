import {
  AgeColumnFilters,
  FromColumnFilters,
  ShardColumnFilters,
  StatusColumnFilters,
  MethodColumnFilters,
  ToColumnFilters,
  ValueColumnFilters
} from 'components';
import { useIsSovereign } from 'hooks';
import { TransactionTableType } from 'types';

export const Header = ({
  showDirectionCol = false,
  inactiveFilters
}: TransactionTableType) => {
  const isSovereign = useIsSovereign();
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
