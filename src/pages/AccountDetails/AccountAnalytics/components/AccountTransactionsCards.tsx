import { useMemo } from 'react';
import moment from 'moment';

import {
  capitalize,
  formatBigNumber,
  getRangeText,
  getStringPlural
} from 'helpers';
import { useGetRangeEntries } from 'hooks';
import { StatsCard } from 'widgets';

import { useGetTransactionHeatmap } from '../hooks';

export const AccountTransactionsCards = () => {
  const processedTransactions = useGetTransactionHeatmap();
  const { values: rangeTransactions, range } = useGetRangeEntries(
    processedTransactions
  );

  const mostActive = useMemo(() => {
    return processedTransactions.reduce(
      (max, current) => (max.value > current.value ? max : current),
      { value: 0, timestamp: Date.now() }
    );
  }, [processedTransactions]);

  const mostActiveRange = useMemo(() => {
    return rangeTransactions.reduce(
      (max, current) => (max.value > current.value ? max : current),
      { value: 0, timestamp: Date.now() }
    );
  }, [rangeTransactions]);

  return (
    <div className='stats-cards equal-width d-flex flex-row flex-wrap gap-3 mb-spacer'>
      <StatsCard
        className='border'
        title='Most Active Day'
        value={`${formatBigNumber({
          value: mostActive.value
        })} ${getStringPlural(mostActive.value, {
          string: 'Transaction'
        })}`}
        subTitle={moment(mostActive.timestamp)
          .utc()
          .format('ddd, MMM DD, YYYY')}
      />
      <StatsCard
        className='border'
        title={`Most Active Day ${capitalize(getRangeText(range))}`}
        value={`${formatBigNumber({
          value: mostActiveRange.value
        })} ${getStringPlural(mostActiveRange.value, {
          string: 'Transaction'
        })}`}
        subTitle={moment(mostActiveRange.timestamp)
          .utc()
          .format('ddd, MMM DD, YYYY')}
      />
    </div>
  );
};
