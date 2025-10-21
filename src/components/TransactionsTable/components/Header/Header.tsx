import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  AgeColumnFilters,
  FromColumnFilters,
  ShardColumnFilters,
  StatusColumnFilters,
  MethodColumnFilters,
  ToColumnFilters,
  ValueColumnFilters,
  DirectionColumnFilters,
  PauseRefreshButton
} from 'components';
import { useIsSovereign } from 'hooks';
import { transactionsSelector } from 'redux/selectors';
import { pauseRefresh, resumeRefresh } from 'redux/slices/transactions';
import { TransactionTableType } from 'types';

export const Header = ({
  showDirectionCol = false,
  address,
  inactiveFilters,
  hasPauseButton
}: TransactionTableType) => {
  const isSovereign = useIsSovereign();
  const { isRefreshPaused } = useSelector(transactionsSelector);

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
        <th
          scope='col'
          className={classNames({
            'd-flex align-item-center justify-content-between': hasPauseButton
          })}
        >
          <div className='d-flex align-item-center'>
            Value <ValueColumnFilters inactiveFilters={inactiveFilters} />
          </div>
          {hasPauseButton && (
            <PauseRefreshButton
              pauseRefresh={pauseRefresh}
              resumeRefresh={resumeRefresh}
              isRefreshPaused={isRefreshPaused}
            />
          )}
        </th>
      </tr>
    </thead>
  );
};
