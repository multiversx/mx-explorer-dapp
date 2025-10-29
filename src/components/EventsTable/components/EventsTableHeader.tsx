import { useSelector } from 'react-redux';

import {
  FromColumnFilters,
  AgeColumnFilters,
  IdentifierColumnFilters,
  ShardFilter,
  PauseRefreshButton
} from 'components';
import { useIsSovereign } from 'hooks';
import { eventsSelector } from 'redux/selectors';
import { pauseEventsRefresh, resumeEventsRefresh } from 'redux/slices';
import { TransactionFiltersEnum, WithClassnameType } from 'types';

export interface EventsTableHeaderUIType extends WithClassnameType {
  inactiveFilters?: TransactionFiltersEnum[];
}

export const EventsTableHeader = ({
  inactiveFilters
}: EventsTableHeaderUIType) => {
  const { isRefreshPaused } = useSelector(eventsSelector);
  const isSovereign = useIsSovereign();
  return (
    <thead>
      <tr>
        <th scope='col'>Txn Hash</th>
        <th scope='col'>
          Age <AgeColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th scope='col'>
          <ShardFilter text={isSovereign ? 'Chain' : 'Shard'} />
        </th>
        <th scope='col' className='hash-xxl'>
          Address <FromColumnFilters inactiveFilters={inactiveFilters} />
        </th>
        <th
          scope='col'
          className='d-flex align-item-center justify-content-between'
        >
          <div className='d-flex align-item-center'>
            Identifier <IdentifierColumnFilters />
          </div>
          <PauseRefreshButton
            pauseRefresh={pauseEventsRefresh}
            resumeRefresh={resumeEventsRefresh}
            isRefreshPaused={isRefreshPaused}
          />
        </th>
      </tr>
    </thead>
  );
};
