import React, { useEffect } from 'react';

import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons/faCircleBolt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { useFetchGrowthHero, useIsMainnet } from 'hooks';
import {
  growthHeroSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';
import { StatsCard } from 'widgets';

export const AccountsStatsCard = ({
  neutralColors
}: {
  neutralColors?: boolean;
}) => {
  const isMainnet = useIsMainnet();

  const { totalAccounts, activeAccountsToday } =
    useSelector(growthHeroSelector);
  const { accounts } = useSelector(statsSelector);
  const { timestamp } = useSelector(refreshSelector);

  const fetchHero = useFetchGrowthHero();

  useEffect(() => {
    fetchHero(true);
  }, [timestamp]);

  return (
    <>
      {isMainnet ? (
        <StatsCard
          title='Total Accounts'
          value={totalAccounts}
          neutralColors={neutralColors}
        >
          <FontAwesomeIcon icon={faCircleBolt} className='me-2' />
          {activeAccountsToday} active today
        </StatsCard>
      ) : (
        <StatsCard title='Total Accounts' value={accounts} />
      )}
    </>
  );
};
