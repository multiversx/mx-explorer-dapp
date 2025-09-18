import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { InfoTooltip } from 'components';
import { useFetchGrowthHero, useHasGrowthWidgets } from 'hooks';
import { faCircleBolt } from 'icons/solid';
import {
  growthHeroSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';
import { StatsCard } from 'widgets';

export const AccountsStatsCard = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { totalAccounts, activeAccountsToday } =
    useSelector(growthHeroSelector);
  const { stats } = useSelector(statsSelector);
  const { timestamp } = useSelector(refreshSelector);

  const { accounts } = stats;

  const fetchHero = useFetchGrowthHero();

  useEffect(() => {
    if (hasGrowthWidgets) {
      fetchHero();
    }
  }, [timestamp, hasGrowthWidgets]);

  return (
    <>
      {hasGrowthWidgets ? (
        <StatsCard title='Total Accounts' value={totalAccounts}>
          <FontAwesomeIcon icon={faCircleBolt} className='me-2' />
          {activeAccountsToday} active today
          <InfoTooltip
            title='Number of accounts that have sent or received transactions in the last 24 hours'
            className='d-inline-flex text-primary'
            persistent
          />
        </StatsCard>
      ) : (
        <StatsCard title='Total Accounts' value={accounts} />
      )}
    </>
  );
};
