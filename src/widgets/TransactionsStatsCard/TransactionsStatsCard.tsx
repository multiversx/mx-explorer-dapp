import { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { useFetchGrowthHero, useIsMainnet } from 'hooks';
import { faCirclePlus } from 'icons/solid';
import {
  growthHeroSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';
import { StatsCard } from 'widgets';

export const TransactionsStatsCard = ({
  className
}: {
  className?: string;
}) => {
  const isMainnet = useIsMainnet();

  const { totalTransactions, totalTransactionsToday } =
    useSelector(growthHeroSelector);
  const { transactions } = useSelector(statsSelector);
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
        <StatsCard
          title='Total Transactions'
          value={totalTransactions}
          className={className}
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
