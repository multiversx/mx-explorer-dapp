import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processGrowthTransactions } from 'helpers';
import { useHasGrowthWidgets } from 'hooks';
import { setGrowthTransactions } from 'redux/slices';
import { useFetchGrowthWidgetOnce } from './useFetchGrowthWidgetOnce';

export const useFetchGrowthTransactions = () => {
  const dispatch = useDispatch();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const fetchGrowthWidgetOnce = useFetchGrowthWidgetOnce();

  const fetchGrowthTransactions = async () => {
    const { data, success } = await fetchGrowthWidgetOnce('/transactions');

    if (data && success) {
      const processedGrowthTransactions = processGrowthTransactions(data);
      const {
        scResults7d,
        scResults30d,
        scResultsAll,
        transactions7d,
        transactions30d,
        transactionsAll,
        ...rest
      } = data;

      dispatch(
        setGrowthTransactions({
          ...processedGrowthTransactions,

          scResults7d: data.scResults7d,
          scResults30d: data.scResults30d,
          scResultsAll: data.scResultsAll,
          transactions7d: data.transactions7d,
          transactions30d: data.transactions30d,
          transactionsAll: data.transactionsAll,

          unprocessed: rest,
          isDataReady: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    if (!hasGrowthWidgets) {
      return;
    }

    fetchGrowthTransactions();
  }, [hasGrowthWidgets]);

  return fetchGrowthTransactions;
};
