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
import { pauseTxRefresh, resumeTxRefresh } from 'redux/slices';
import { TransactionTableType } from 'types';

export const Header = ({
  showDirectionCol = false,
  address,
  inactiveFilters,
  hasPauseButton,
  hasTxPreviewBtn
}: TransactionTableType) => {
  const isSovereign = useIsSovereign();
  const { isRefreshPaused } = useSelector(transactionsSelector);

  return (
    <thead>
      <tr>
        {hasTxPreviewBtn && <th scope='col'></th>}
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
              pauseRefresh={pauseTxRefresh}
              resumeRefresh={resumeTxRefresh}
              isRefreshPaused={isRefreshPaused}
            />
          )}
        </th>
      </tr>
    </thead>
  );
};
