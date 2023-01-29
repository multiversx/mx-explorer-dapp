import React from 'react';

import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons/faCirclePlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { useFetchGrowthHero, useIsMainnet } from 'hooks';
import { growthHeroSelector, statsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const TransactionsStatsCard = ({
  neutralColors
}: {
  neutralColors?: boolean;
}) => {
  const isMainnet = useIsMainnet();

  const { totalTransactions, totalTransactionsToday } =
    useSelector(growthHeroSelector);
  const { transactions } = useSelector(statsSelector);

  useFetchGrowthHero();

  return (
    <>
      {isMainnet ? (
        <StatsCard
          title='Total Transactions'
          value={totalTransactions}
          neutralColors={neutralColors}
        >
          <FontAwesomeIcon icon={faCirclePlus} className='me-2' />
          {totalTransactionsToday} today
        </StatsCard>
      ) : (
        <StatsCard title='Total Transactions' value={transactions} />
      )}
    </>
  );
};
