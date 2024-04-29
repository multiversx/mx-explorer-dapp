import { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { useFetchGrowthHero, useHasGrowthWidgets } from 'hooks';
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
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { totalTransactions, totalTransactionsToday } =
    useSelector(growthHeroSelector);
  const { transactions } = useSelector(statsSelector);
  const { timestamp } = useSelector(refreshSelector);

  const fetchHero = useFetchGrowthHero();

  useEffect(() => {
    if (hasGrowthWidgets) {
      fetchHero();
    }
  }, [timestamp, hasGrowthWidgets]);

  return (
    <>
      {hasGrowthWidgets ? (
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
