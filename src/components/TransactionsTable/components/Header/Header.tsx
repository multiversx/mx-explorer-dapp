import {
  AgeColumnFilters,
  FromColumnFilters,
  ShardColumnFilters,
  StatusColumnFilters,
  MethodColumnFilters,
  ToColumnFilters,
  ValueColumnFilters,
  DirectionColumnFilters
} from 'components';
import { useIsSovereign } from 'hooks';
import { TransactionTableType } from 'types';

export const Header = ({
  showDirectionCol = false,
  address,
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
        {showDirectionCol && (
          <th scope='col'>
            <DirectionColumnFilters
              inactiveFilters={inactiveFilters}
              address={address}
            />
          </th>
        )}
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
