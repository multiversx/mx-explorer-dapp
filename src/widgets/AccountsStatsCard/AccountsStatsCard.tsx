import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { POOLING_REFRESH_RATE_LIMIT } from 'appConstants';
import { FormatNumber, InfoTooltip } from 'components';
import { formatBigNumber } from 'helpers';
import { useGetNewAccountsToday, useHasGrowthWidgets } from 'hooks';
import { faCircleBolt } from 'icons/solid';
import { activeNetworkSelector, statsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const AccountsStatsCard = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { refreshRate } = useSelector(activeNetworkSelector);
  const { unprocessed } = useSelector(statsSelector);
  const { accounts } = unprocessed;

  const newAccountsToday = useGetNewAccountsToday();
  const isAnimated = Boolean(
    refreshRate && refreshRate < POOLING_REFRESH_RATE_LIMIT
  );

  return (
    <StatsCard
      title='Total Accounts'
      value={
        <FormatNumber
          value={accounts}
          isAnimated={isAnimated}
          showEllipsisIfZero
        />
      }
      isAnimated={isAnimated}
    >
      {hasGrowthWidgets && (
        <>
          <FontAwesomeIcon icon={faCircleBolt} className='me-2' />
          {formatBigNumber({
            value: newAccountsToday,
            showEllipsisIfZero: true
          })}{' '}
          active today
          <InfoTooltip
            title='Number of accounts that have sent or received transactions in the last 24 hours'
            className='d-inline-flex text-primary'
            persistent
          />
        </>
      )}
    </StatsCard>
  );
};
