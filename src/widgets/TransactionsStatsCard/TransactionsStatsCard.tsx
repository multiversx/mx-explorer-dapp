import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { POOLING_REFRESH_RATE_LIMIT } from 'appConstants';
import { FormatNumber } from 'components';
import { formatBigNumber } from 'helpers';
import { useGetNewTransactionsToday, useHasGrowthWidgets } from 'hooks';
import { faCirclePlus } from 'icons/solid';
import { activeNetworkSelector, statsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const TransactionsStatsCard = ({
  className
}: {
  className?: string;
}) => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { refreshRate } = useSelector(activeNetworkSelector);
  const { unprocessed } = useSelector(statsSelector);
  const { transactions } = unprocessed;

  const newTransactionsToday = useGetNewTransactionsToday();

  const isAnimated = Boolean(
    refreshRate && refreshRate < POOLING_REFRESH_RATE_LIMIT
  );

  return (
    <StatsCard
      title='Total Transactions'
      value={
        <FormatNumber
          value={transactions}
          isAnimated={isAnimated}
          showEllipsisIfZero
        />
      }
      className={className}
      isAnimated={isAnimated}
    >
      {hasGrowthWidgets && (
        <>
          <FontAwesomeIcon icon={faCirclePlus} className='me-2' />
          {formatBigNumber({
            value: newTransactionsToday,
            showEllipsisIfZero: true
          })}{' '}
          today
        </>
      )}
    </StatsCard>
  );
};
