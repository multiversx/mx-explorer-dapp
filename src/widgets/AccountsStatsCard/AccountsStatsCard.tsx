import { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { useFetchGrowthHero, useIsMainnet } from 'hooks';
import { faCircleBolt } from 'icons/solid';
import {
  growthHeroSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';
import { StatsCard } from 'widgets';

export const AccountsStatsCard = () => {
  const isMainnet = useIsMainnet();

  const { totalAccounts, activeAccountsToday } =
    useSelector(growthHeroSelector);
  const { accounts } = useSelector(statsSelector);
  const { timestamp } = useSelector(refreshSelector);

  const fetchHero = useFetchGrowthHero();

  useEffect(() => {
    if (isMainnet) {
      fetchHero(true);
    }
  }, [timestamp, isMainnet]);

  return (
    <>
      {isMainnet ? (
        <StatsCard title='Total Accounts' value={totalAccounts}>
          <FontAwesomeIcon icon={faCircleBolt} className='me-2' />
          {activeAccountsToday} active today
        </StatsCard>
      ) : (
        <StatsCard title='Total Accounts' value={accounts} />
      )}
    </>
  );
};
