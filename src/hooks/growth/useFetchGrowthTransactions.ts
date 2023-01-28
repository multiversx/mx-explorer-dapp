import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from 'components';
import { processGrowthTransactions } from 'helpers';

import { growthTransactionsSelector } from 'redux/selectors';
import { setGrowthTransactions } from 'redux/slices/growthTransactions';

export const useFetchGrowthTransactions = () => {
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthTransactionsSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchTransactions = () => {
    if (!isFetched) {
      getGrowthWidget('/transactions').then(({ data, success }) => {
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
              isFetched: success
            })
          );
        }
      });
    }
  };

  React.useEffect(fetchTransactions, []);
};
