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
            scResults30d,
            scResultsAll,
            transactions30d,
            transactionsAll,
            ...rest
          } = data;

          dispatch(
            setGrowthTransactions({
              ...processedGrowthTransactions,

              scResults30d: data.scResults30d,
              scResultsAll: data.scResultsAll,
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
