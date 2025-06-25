import {
  FromColumnFilters,
  ShardColumnFilters,
  AgeColumnFilters,
  IdentifierColumnFilters
} from 'components';
import { useIsSovereign } from 'hooks';
import { TransactionFiltersEnum, WithClassnameType } from 'types';

export interface EventsTableHeaderUIType extends WithClassnameType {
  inactiveFilters?: TransactionFiltersEnum[];
}

export const EventsTableHeader = ({
  inactiveFilters
}: EventsTableHeaderUIType) => {
  const isSovereign = useIsSovereign();
  return (
    <thead>
      <tr>
        <th scope='col'>Txn Hash</th>
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
        <th scope='col' className='hash-xxl'>
          Address <FromColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          Identifier <IdentifierColumnFilters />
        </th>
      </tr>
    </thead>
  );
};
